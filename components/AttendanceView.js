import isEmpty from 'lodash.isempty';
import capitalize from 'lodash.capitalize';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@mui/material'

const colors = {
  'fox': '#b97c38',
  'hawk': '#eab71b',
  'mountain lion': '#cea54a',
};

function AttendanceView(props) {
  const { members, schedule } = props;

  return (
    <div>
      {schedule
        .filter(event => !isEmpty(event.attendance))
        .map((event, index) => (
          <Accordion key={event.name + event.date}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
              sx={{ backgroundColor: 'darkgray' }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>
                {event.date} - {event.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{
              padding: 0,
              backgroundColor: 'white',
            }}>
              <Box sx={{ padding: 1 }}>
                {event.branch} - {event.type}
              </Box> 
              {Object.keys(event.attendance).map((patrol) => (
                <Box
                  sx={{
                    backgroundColor: colors[patrol],
                    padding: 1,
                  }}
                  key={patrol}
                >
                  <Box sx={{ fontWeight: 'bold' }}>{capitalize(patrol)}</Box>
                  <ul style={{ margin: 0 }}>
                    {Object.keys(event.attendance[patrol]).map((name) => (
                      <li className='member-name' key={name}>{name}</li>
                    ))}
                  </ul>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}

export default AttendanceView;