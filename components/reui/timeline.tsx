import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type Orientation = "horizontal" | "vertical";
type TimelineContextValue = { orientation: Orientation; activeStep: number };
const TimelineContext = createContext<TimelineContextValue>({ orientation: "vertical", activeStep: 0 });

type TimelineProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: number;
  orientation?: Orientation;
  children: ReactNode;
};

export function Timeline({ defaultValue = 0, orientation = "vertical", className = "", children, ...props }: TimelineProps) {
  return (
    <TimelineContext.Provider value={{ orientation, activeStep: defaultValue }}>
      <div className={`reui-timeline ${className}`.trim()} data-orientation={orientation} role="list" {...props}>
        {children}
      </div>
    </TimelineContext.Provider>
  );
}

type TimelineItemProps = HTMLAttributes<HTMLDivElement> & { step: number };

export function TimelineItem({ step, className = "", children, ...props }: TimelineItemProps) {
  const { activeStep } = useContext(TimelineContext);
  return (
    <div className={`reui-timeline-item ${className}`.trim()} data-active={step <= activeStep} data-current={step === activeStep} role="listitem" {...props}>
      {children}
    </div>
  );
}

export function TimelineHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`reui-timeline-header ${props.className ?? ""}`.trim()} />;
}

export function TimelineSeparator(props: HTMLAttributes<HTMLSpanElement>) {
  return <span aria-hidden="true" {...props} className={`reui-timeline-separator ${props.className ?? ""}`.trim()} />;
}

export function TimelineDate(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={`reui-timeline-date ${props.className ?? ""}`.trim()} />;
}

export function TimelineTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={`reui-timeline-title ${props.className ?? ""}`.trim()} />;
}

export function TimelineIndicator(props: HTMLAttributes<HTMLSpanElement>) {
  return <span aria-hidden="true" {...props} className={`reui-timeline-indicator ${props.className ?? ""}`.trim()} />;
}

export function TimelineContent(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={`reui-timeline-content ${props.className ?? ""}`.trim()} />;
}
