import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { action } from "mobx"
import { observer } from "mobx-react-lite";
import { getAllFormats } from '../format/Format';
import { ObserverInput, parseNumberInString } from './ObserverInput';
import { Quantity, UnitOfLength } from '../types/Unit';
import { UpdateProperties } from '../types/Command';
import { useAppStores } from './MainApp';
import { ObserverEnumSelect } from './ObserverEnumSelect';
import { ObserverCheckbox } from './ObserverCheckbox';
import { CodePointBuffer, Computation, NumberUOL } from '../token/Tokens';

const GeneralConfigAccordion = observer((props: {}) => {
  const { app, confirmation } = useAppStores();

  const gc = app.gc;

  const formats = getAllFormats();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Configuration</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography gutterBottom>Format</Typography>
        <Box className="panel-box">
          <Select size="small" sx={{ maxWidth: "100%" }}
            value={formats.findIndex((x) => x.getName() === app.format.getName())}
            onChange={action((e: SelectChangeEvent<number>) => {
              confirmation.prompt({
                title: "Change Format",
                description: "Some incompatible path configurations will be discarded. Edit history will be reset. Are you sure?",
                buttons: [
                  { label: "Confirm", onClick: () => app.format = formats[parseInt(e.target.value + "")] },
                  { label: "Cancel" },
                ]
              });
            })}>
            {
              formats.map((x, i) => {
                return <MenuItem key={i} value={i}>{x.getName()}</MenuItem>
              })
            }
          </Select>
        </Box>
        <Box className="flex-editor-panel" sx={{ marginTop: "2vh" }}>
          <ObserverEnumSelect label="Unit of Length" enumValue={gc.uol} onEnumChange={
            (v) => app.history.execute(`Set Unit of Length`, new UpdateProperties(gc, { "uol": v }))
          } enumType={UnitOfLength} />
          <ObserverInput
            sx={{ width: "7rem" }}
            label="Point Density"
            getValue={() => gc.pointDensity.toUser() + ""}
            setValue={(value: string) => app.history.execute(
              `Change point density`,
              new UpdateProperties(gc, {
                "pointDensity": parseNumberInString(
                  Computation.parseWith(new CodePointBuffer(value), NumberUOL.parse)!.compute(app.gc.uol).toString(),
                  gc.uol,
                  new Quantity(0.1, UnitOfLength.Centimeter),
                  new Quantity(100, UnitOfLength.Centimeter)
                )
              })
            )}
            isValidIntermediate={() => true}
            isValidValue={(candidate: string) => {
              return Computation.parseWith(new CodePointBuffer(candidate), NumberUOL.parse) !== null;
            }}
            numeric
          />
        </Box>
        <Typography sx={{ marginTop: "2vh" }} gutterBottom>Robot Visualize</Typography>
        <Box className='flex-editor-panel'>
          <ObserverInput
            label="Width"
            getValue={() => gc.robotWidth.toUser() + ""}
            setValue={(value: string) => app.history.execute(
              `Change robot width`,
              new UpdateProperties(gc, {
                "robotWidth": parseNumberInString(
                  Computation.parseWith(new CodePointBuffer(value), NumberUOL.parse)!.compute(app.gc.uol).toString(),
                  gc.uol,
                  new Quantity(1, UnitOfLength.Centimeter),
                  new Quantity(100, UnitOfLength.Centimeter)
                )
              })
            )}
            isValidIntermediate={() => true}
            isValidValue={(candidate: string) => {
              return Computation.parseWith(new CodePointBuffer(candidate), NumberUOL.parse) !== null;
            }}
            numeric
          />
          <ObserverInput
            label="Height"
            getValue={() => gc.robotHeight.toUser() + ""}
            setValue={(value: string) => app.history.execute(
              `Change robot height`,
              new UpdateProperties(gc, {
                "robotHeight": parseNumberInString(
                  Computation.parseWith(new CodePointBuffer(value), NumberUOL.parse)!.compute(app.gc.uol).toString(),
                  gc.uol,
                  new Quantity(1, UnitOfLength.Centimeter),
                  new Quantity(100, UnitOfLength.Centimeter)
                )
              })
            )}
            isValidIntermediate={() => true}
            isValidValue={(candidate: string) => {
              return Computation.parseWith(new CodePointBuffer(candidate), NumberUOL.parse) !== null;
            }}
            numeric
          />
          <ObserverCheckbox label="Visible" title='Toggle Robot Visibility (R)' checked={gc.showRobot} onCheckedChange={(c) => gc.showRobot = c} />
        </Box>
        <Box className='flex-editor-panel'>
          <ObserverCheckbox label="Holonomic Drive" checked={gc.robotIsHolonomic} onCheckedChange={(c) => {
            app.history.execute(
              `Change robot is holonomic drive`,
              new UpdateProperties(gc, { "robotIsHolonomic": c })
            );
          }} />
        </Box>
        {gc.getConfigPanel(app)}
      </AccordionDetails>
    </Accordion>
  )
});

export { GeneralConfigAccordion };
