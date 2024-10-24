import { makeAutoObservable } from "mobx";
import { Path, BentRateApplicationDirection } from "@src/core/Path";
import { NumberRange, EditableNumberRange, ValidateEditableNumberRange } from "@src/core/Util";
import { Exclude, Expose } from "class-transformer";
import { PathConfig } from "../Config";
import { Format } from "../Format";
import { observer } from "mobx-react-lite";
import { getAppStores } from "@src/core/MainApp";
import React from "react";
import { LayoutContext, LayoutType, PanelBuilderProps, PanelInstanceProps } from "@src/core/Layout";
import { PanelBox } from "@src/app/component.blocks/PanelBox";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import { Typography } from "@mui/material";
import { UpdateProperties } from "@src/core/Command";
import { RangeSlider } from "@src/app/component.blocks/RangeSlider";

export class PathConfigImpl implements PathConfig {
  lookaheadLimit?: NumberRange | undefined;
  @ValidateEditableNumberRange(-Infinity, Infinity)
  @Expose()
  speedLimit: EditableNumberRange = {
    minLimit: { value: 0, label: "0" },
    maxLimit: { value: 65535, label: "65535" },
    step: 1,
    from: 20000,
    to: 100
  };
  @ValidateEditableNumberRange(-Infinity, Infinity)
  @Expose()
  bentRateApplicableRange: EditableNumberRange = {
    minLimit: { value: 0, label: "0" },
    maxLimit: { value: 1, label: "1" },
    step: 0.001,
    from: 0,
    to: 0.1
  };
  @Exclude()
  bentRateApplicationDirection = BentRateApplicationDirection.HighToLow;

  @Exclude()
  public path!: Path;

  @Exclude()
  readonly format: Format;

  constructor(format: Format) {
    this.format = format;
    makeAutoObservable(this);
  }
}

const PathConfigPanelBody = observer((props: {}) => {
  const { app } = getAppStores();

  const pc = app.selectedPath?.pc as PathConfigImpl | undefined;

  const isClassic = React.useContext(LayoutContext) === LayoutType.Classic;

  if (pc === undefined) {
    return isClassic ? undefined : <Typography>(No selected path)</Typography>;
  }

  return (
    <>
      <Typography>Min/Max Speed</Typography>
      <PanelBox marginTop="0px" marginBottom="16px">
        <RangeSlider
          range={pc.speedLimit}
          onChange={(from, to) =>
            app.history.execute(
              `Change path ${pc.path.uid} min/max speed`,
              new UpdateProperties(pc.speedLimit, { from, to })
            )
          }
        />
      </PanelBox>
      <Typography>Bent Rate Applicable Range</Typography>
      <PanelBox marginTop="0px" marginBottom="16px">
        <RangeSlider
          range={pc.bentRateApplicableRange}
          onChange={(from, to) =>
            app.history.execute(
              `Change path ${pc.path.uid} bent rate applicable range`,
              new UpdateProperties(pc.bentRateApplicableRange, { from, to })
            )
          }
        />
      </PanelBox>
    </>
  );
});

export const PathConfigPanel = (props: PanelBuilderProps): PanelInstanceProps => {
  return {
    id: "PathConfigAccordion",
    header: "Path",
    children: <PathConfigPanelBody />,
    icon: <LinearScaleIcon fontSize="large" />
  };
};
