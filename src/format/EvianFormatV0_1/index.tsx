import { makeAutoObservable } from "mobx";
import { getPathPoints, PointCalculationResult } from "@src/core/Calculation";
import { UserInterface } from "@src/core/Layout";
import { MainApp } from "@src/core/MainApp";
import { Segment, Path } from "@src/core/Path";
import { convertFormat, GeneralConfig } from "../Config";
import { Format } from "../Format";
import { makeId } from "@src/core/Util";
import { GeneralConfigImpl } from "./GeneralConfig";
import { PathConfigImpl, PathConfigPanel } from "./PathConfig";
import { Quantity } from "@src/core/Unit";

export class EvianFormatV0_1 implements Format {
  isInit: boolean = false;
  uid: string;

  generalConfig = new GeneralConfigImpl(this);

  pathUiDisposer: (() => void) | undefined;

  constructor() {
    this.uid = makeId(10);
    makeAutoObservable(this);
  }

  getName(): string {
    return "evian Path Format v0.1.0";
  }
  getDescription(): string {
    return "Path file format for evian.";
  }
  register(app: MainApp, ui: UserInterface): void {
    if (this.isInit) return;
    this.isInit = true;

    this.pathUiDisposer = ui.registerPanel(PathConfigPanel).disposer;
  }
  unregister(): void {
    this.pathUiDisposer?.();
  }
  createNewInstance(): Format {
    return new EvianFormatV0_1();
  }
  getGeneralConfig(): GeneralConfig {
    return this.generalConfig;
  }
  createPath(...segments: Segment[]): Path {
    return new Path(new PathConfigImpl(this), ...segments);
  }
  getPathPoints(path: Path): PointCalculationResult {
    return getPathPoints(path, new Quantity(this.generalConfig.pointDensity, this.generalConfig.uol));
  }
  convertFromFormat(oldFormat: Format, oldPaths: Path[]): Path[] {
    return convertFormat(this, oldFormat, oldPaths);
  }
  importPathsFromFile(buffer: ArrayBuffer): Path[] {
    // TODO
    throw new Error("Method not implemented.");
  }
  importPDJDataFromFile(buffer: ArrayBuffer): Record<string, any> | undefined {
    // TODO
    return undefined;
  }
  exportFile(): ArrayBuffer {
    throw new Error("Method not implemented.");
  }
}
