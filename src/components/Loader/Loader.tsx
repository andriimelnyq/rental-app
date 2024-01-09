import { CircularProgress } from '@mui/material';
import './Loader.scss';

const Loader = () => (
  <div
    className="loader"
  >
    <CircularProgress
      sx={{
        margin: 'auto',
      }}
    />
  </div>
);

export default Loader;
