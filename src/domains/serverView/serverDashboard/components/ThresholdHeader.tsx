import { useState, useEffect } from "react";
import CpuIcon from "../assets/cpu.svg";
import MemoryIcon from "../assets/memory.svg";
import DiskIcon from "../assets/disk.svg";
import ThresholdMetricInput from "./ThresholdmetricInput";
import ButtonPlaceholder from "./ButtonPlaceholder";

export interface ThresholdValues {
  cpu: { warning: number; critical: number };
  memory: { warning: number; critical: number };
  disk: { warning: number; critical: number };
}

interface ThresholdHeaderProps {
  initialValues?: ThresholdValues;
  onSave?: (values: ThresholdValues) => void;
  isOpen?: boolean;
}

function ThresholdHeader({
  initialValues = {
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 75, critical: 90 },
    disk: { warning: 80, critical: 95 },
  },
  onSave,
  isOpen,
}: ThresholdHeaderProps) {
  const [editMode, setEditMode] = useState(false);
  const [values, setValues] = useState<ThresholdValues>(initialValues);

  useEffect(() => {
    if (!isOpen) {
      setEditMode(false);
    }
  }, [isOpen]);

  const handleValueChange = (
    metric: keyof ThresholdValues,
    type: "warning" | "critical",
    value: number
  ) => {
    setValues((prev) => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        [type]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave?.(values);
    setEditMode(false);
  };

  const handleReset = () => {
    setValues(initialValues);
    setEditMode(false);
  };

  return (
    <div className="bg-white/5 border border-slate-300/40 rounded-xl p-4">
      <div className="flex items-center gap-7">
        {/* Left: Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-white text-sm font-semibold">임계치 설정</span>
        </div>

        {/* Center: Metrics */}
        <div className="flex items-center gap-3 flex-1">
          {/* CPU */}
          <ThresholdMetricInput
            label="CPU"
            icon={CpuIcon}
            warningValue={values.cpu.warning}
            criticalValue={values.cpu.critical}
            editMode={editMode}
            onWarningChange={(value) =>
              handleValueChange("cpu", "warning", value)
            }
            onCriticalChange={(value) =>
              handleValueChange("cpu", "critical", value)
            }
          />

          {/* Memory */}
          <ThresholdMetricInput
            label="MEM"
            icon={MemoryIcon}
            warningValue={values.memory.warning}
            criticalValue={values.memory.critical}
            editMode={editMode}
            onWarningChange={(value) =>
              handleValueChange("memory", "warning", value)
            }
            onCriticalChange={(value) =>
              handleValueChange("memory", "critical", value)
            }
          />

          {/* Disk */}
          <ThresholdMetricInput
            label="DISK"
            icon={DiskIcon}
            warningValue={values.disk.warning}
            criticalValue={values.disk.critical}
            editMode={editMode}
            onWarningChange={(value) =>
              handleValueChange("disk", "warning", value)
            }
            onCriticalChange={(value) =>
              handleValueChange("disk", "critical", value)
            }
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ButtonPlaceholder
            editMode={editMode}
            onReset={handleReset}
            onSave={handleSave}
            onToggleEdit={() => setEditMode(!editMode)}
          />
        </div>
      </div>
    </div>
  );
}

export default ThresholdHeader;
