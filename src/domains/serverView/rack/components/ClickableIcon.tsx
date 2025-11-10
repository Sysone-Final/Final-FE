import { Group, Image } from "react-konva";

interface ClickableIconProps {
  image: HTMLImageElement | null;
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
}

function ClickableIcon({
  image,
  x,
  y,
  width,
  height,
  onClick,
}: ClickableIconProps) {
  if (!image) return null;

  return (
    <Group
      x={x}
      y={y}
      onClick={(e) => {
        e.cancelBubble = true;
        onClick();
      }}
      onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "pointer";
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "default";
      }}
    >
      <Image
        image={image as CanvasImageSource}
        x={0}
        y={0}
        width={width}
        height={height}
      />
    </Group>
  );
}

export default ClickableIcon;
