import { Option, Select, Typography, useToast } from "@wanteddev/wds";
import { IconSearch, IconUpload } from "@wanteddev/wds-icon";
import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { RecordingCard, SongPickCard } from "@/components/card/PickCard";
import Cover, { coverToneOf, PART_COVER_TONE } from "@/components/music/Cover";
import BottomActionArea from "@/components/ui/BottomActionArea";
import LoaderWave from "@/components/ui/LoaderWave";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AnalysisInProgressSheet from "@/features/practice/components/AnalysisInProgressSheet";
import PartSelectSheet from "@/features/practice/components/PartSelectSheet";
import PickPlaceholder from "@/features/practice/components/PickPlaceholder";
import SongSelectSheet from "@/features/practice/components/SongSelectSheet";
import {
  formatFileSize,
  RECORDING_ACCEPT,
  RECORDING_LIMIT,
} from "@/features/practice/practiceHelpers";
import {
  requestPracticeAnalysis,
  uploadPracticeAudio,
} from "@/features/practice/practiceStore";
import { formatDuration } from "@/lib/domain/format";
import { INSTRUMENT_LABEL, INSTRUMENT_OPTIONS } from "@/lib/domain/labels";
import type { Instrument, SongSummary } from "@/lib/domain/types";
import { getMe, getSong } from "@/mocks/selectors";

// Figma 11 새 연습 분석(424:14695) + 25 파트 선택 시트. 서버 흐름(§13): 업로드 URL 발급 → 녹음 PUT →
// 곡(songId) · 파트(part) · 녹음(audioUrl) · 제목으로 분석 요청(202 SUBMITTED). 제목은 서버 필수값이라
// "{곡} {파트} 연습"으로 만들어 보낸다. 녹음은 3~60초 · 1.95MB 이하 mp3·m4a·wav만 받는다.
// "분석하기"를 누르면 올리는 동안 버튼에 작은 웨이브를 띄우고, 요청이 받아지면 그 녹음의 비교 중(29)
// 화면으로 replace한다. 진행 중인 내 분석이 이미 있으면(409) 그 녹음으로 가는 시트를 띄운다.
// "다시 녹음"·"다른 녹음"·"새 녹음 올리기"에서 오면 ?songId=&part=로 곡·파트가 채워져 있다.

interface PickedRecording {
  file: File;
  fileName: string;
  sizeBytes: number;
  durationSec: number;
}

const TITLE_MAX_LENGTH = 100;

function toPart(param: string | null): Instrument | null {
  return INSTRUMENT_OPTIONS.find((part) => part === param) ?? null;
}

function toSong(param: string | null): SongSummary | null {
  if (!param) return null;
  const song = getSong(Number(param));
  return song ? { artist: song.artist, id: song.id, title: song.title } : null;
}

/** 녹음 길이(초). 브라우저가 못 읽는 형식이면 null. */
function readDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const finish = (value: number | null) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    audio.preload = "metadata";
    audio.onloadedmetadata = () =>
      finish(Number.isFinite(audio.duration) ? audio.duration : null);
    audio.onerror = () => finish(null);
    audio.src = url;
  });
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section className="flex flex-col gap-2.5">
      <Typography
        as="h2"
        color="semantic.label.alternative"
        variant="label1"
        weight="medium"
      >
        {label}
      </Typography>
      {children}
    </section>
  );
}

function PracticeNewScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const myParts = getMe().instruments.map((item) => item.instrument);

  const [song, setSong] = useState(() => toSong(searchParams.get("songId")));
  const [part, setPart] = useState<Instrument | null>(
    () => toPart(searchParams.get("part")) ?? myParts[0] ?? null,
  );
  const [recording, setRecording] = useState<PickedRecording | null>(null);
  const [songSheetOpen, setSongSheetOpen] = useState(false);
  const [partSheetOpen, setPartSheetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [inProgressOpen, setInProgressOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 올리는 동안 화면을 떠났으면 분석을 요청하지 않는다.
  const leftRef = useRef(false);
  useEffect(() => {
    leftRef.current = false;
    return () => {
      leftRef.current = true;
    };
  }, []);

  useScreenHeader(useMemo(() => <ScreenHeader title="새 연습 분석" />, []));

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // 같은 파일을 다시 골라도 change가 오도록 비운다.
    input.value = "";
    if (!file) return;

    if (file.size > RECORDING_LIMIT.maxBytes) {
      toast({
        content: `${formatFileSize(RECORDING_LIMIT.maxBytes)} 이하 녹음만 올릴 수 있어요`,
        variant: "negative",
      });
      return;
    }
    const durationSec = await readDuration(file);
    if (durationSec === null) {
      toast({ content: "녹음 길이를 읽지 못했어요", variant: "negative" });
      return;
    }
    if (
      durationSec < RECORDING_LIMIT.minSec ||
      durationSec > RECORDING_LIMIT.maxSec
    ) {
      toast({
        content: `${RECORDING_LIMIT.minSec}~${RECORDING_LIMIT.maxSec}초 녹음만 올릴 수 있어요`,
        variant: "negative",
      });
      return;
    }
    setRecording({
      durationSec,
      file,
      fileName: file.name,
      sizeBytes: file.size,
    });
  };

  const submit = async () => {
    if (!song || !part || !recording || uploading) return;
    setUploading(true);
    const audioUrl = await uploadPracticeAudio(recording.file);
    if (leftRef.current) return;
    setUploading(false);
    const result = requestPracticeAnalysis({
      audioUrl,
      durationSec: recording.durationSec,
      part,
      song,
      title: `${song.title} ${INSTRUMENT_LABEL[part]} 연습`.slice(
        0,
        TITLE_MAX_LENGTH,
      ),
    });
    if (!result.ok) {
      setInProgressOpen(true);
      return;
    }
    navigate(`/practice/${result.recording.id}`, { replace: true });
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-7 px-5 pt-3">
        <Field label="곡">
          {song ? (
            <SongPickCard
              artist={song.artist}
              cover={
                <Cover
                  className="size-12 rounded-sm"
                  part={part ?? undefined}
                  tone={
                    part ? PART_COVER_TONE[part] : coverToneOf("song", song.id)
                  }
                />
              }
              onChange={() => setSongSheetOpen(true)}
              title={song.title}
            />
          ) : (
            <PickPlaceholder
              icon={<IconSearch className="size-6" />}
              meta="연습한 곡을 찾아 주세요"
              onClick={() => setSongSheetOpen(true)}
              title="곡 찾기"
            />
          )}
        </Field>

        <Field label="내 파트">
          {/* 고르기는 드롭다운 대신 25 파트 선택 시트로 — Select는 열리지 않게 두고 시트를 띄운다. */}
          <Select
            aria-label="내 파트"
            onOpenChange={(next) => {
              if (next) setPartSheetOpen(true);
            }}
            open={false}
            placeholder="파트를 골라 주세요"
            value={part ?? ""}
            width="100%"
          >
            {INSTRUMENT_OPTIONS.map((option) => (
              <Option key={option} value={option}>
                {INSTRUMENT_LABEL[option]}
              </Option>
            ))}
          </Select>
        </Field>

        <Field label="녹음">
          {recording ? (
            <RecordingCard
              fileName={recording.fileName}
              meta={`${formatDuration(recording.durationSec)} · ${formatFileSize(recording.sizeBytes)}`}
              onChange={openFilePicker}
            />
          ) : (
            <PickPlaceholder
              icon={<IconUpload className="size-6" />}
              meta="mp3 · m4a · wav 파일"
              onClick={openFilePicker}
              title="녹음 파일 올리기"
            />
          )}
          <input
            accept={RECORDING_ACCEPT}
            className="hidden"
            onChange={handleFile}
            ref={fileInputRef}
            type="file"
          />
          <Typography color="semantic.label.assistive" variant="label2">
            원곡과 같은 키·빠르기로 녹음하면 더 정확해요.
            <br />
            {RECORDING_LIMIT.minSec}~{RECORDING_LIMIT.maxSec}초,{" "}
            {formatFileSize(RECORDING_LIMIT.maxBytes)} 이하 녹음만 분석할 수
            있어요.
          </Typography>
        </Field>
      </ScreenBody>

      <BottomActionArea
        disabled={!song || !part || !recording}
        label={
          uploading ? (
            <>
              <LoaderWave />
              <span className="sr-only">녹음 올리는 중</span>
            </>
          ) : (
            "분석하기"
          )
        }
        onClick={submit}
      />

      <SongSelectSheet
        onOpenChange={setSongSheetOpen}
        onSelect={(next) =>
          setSong({ artist: next.artist, id: next.id, title: next.title })
        }
        open={songSheetOpen}
        selectedId={song?.id ?? null}
      />
      <PartSelectSheet
        myParts={myParts}
        onOpenChange={setPartSheetOpen}
        onSelect={setPart}
        open={partSheetOpen}
        value={part}
      />
      <AnalysisInProgressSheet
        onOpenChange={setInProgressOpen}
        open={inProgressOpen}
        replace
      />
    </>
  );
}

export default PracticeNewScreen;
