import { Typography } from "@wanteddev/wds";
import { IconCheck, IconChevronDown } from "@wanteddev/wds-icon";
import { useState } from "react";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

// Figma의 "값 + 아래 화살표" 입력 칸(모임 유형, 활동 지역 …). 디자인에 펼친 상태가 없어서
// 화면마다 눌러도 아무 일도 안 일어나는 버튼으로 남아 있었다. 선택지는 화면 이동이 아니라
// 그 자리에서 고르는 값이라, 라우트 대신 MemberActionSheet와 같은 방식의 바텀시트로 처리한다.
// 시트는 ScreenLayout이 프레임 최상단에 마련해 둔 포털에 그려서 브라우저 전체가 아니라
// 폰 프레임 안에서만 딤 처리된다.
interface SelectFieldProps {
  /** 시트 상단에 뜨는 제목 — 보통 입력 칸의 라벨과 같다. */
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function SelectField({ onChange, options, title, value }: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const portalEl = useScreenSheetPortal();

  return (
    <>
      <button
        className="flex w-full items-center gap-2 rounded-xl bg-surface p-3"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Typography
          className="flex-1 text-left"
          color="semantic.label.normal"
          variant="body1"
          weight="regular"
        >
          {value}
        </Typography>
        <IconChevronDown className="size-4 text-label-normal" />
      </button>

      {isOpen &&
        portalEl !== null &&
        createPortal(
          <div className="pointer-events-auto absolute inset-0">
            <button
              aria-label="닫기"
              className="absolute inset-0 bg-black/45"
              onClick={() => setIsOpen(false)}
              type="button"
            />
            <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-1 rounded-t-3xl bg-surface-elevated px-6 pt-3 pb-10">
              <div className="mx-auto h-1 w-10 rounded-full bg-white/10" />
              <div className="py-3">
                <Typography
                  color="semantic.label.normal"
                  variant="heading2"
                  weight="bold"
                >
                  {title}
                </Typography>
              </div>
              {options.map((option) => (
                <button
                  className="flex items-center gap-2 py-3.5 text-left"
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  <Typography
                    className="flex-1"
                    color={
                      option === value
                        ? "semantic.primary.normal"
                        : "semantic.label.normal"
                    }
                    variant="body1"
                    weight={option === value ? "bold" : "regular"}
                  >
                    {option}
                  </Typography>
                  {option === value && (
                    <IconCheck className="size-5 text-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>,
          portalEl,
        )}
    </>
  );
}

export default SelectField;
