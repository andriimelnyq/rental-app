import './App.scss'
import { useEffect, useState } from "react";
import Map from "./components/Map/Map";
import Loader from "./components/Loader/Loader.tsx";
import { useAppDispatch, useAppSelector } from "./utils/hooks";
import { actions, init } from "./store/rentItems";
import { Alert, Snackbar } from "@mui/material";
import { TError, TRentalItem } from "./types";
import CardsList from "./components/CardsList/CardsList.tsx";

function App() {
  const { loading, rentItems, error } = useAppSelector(state => state.rentItems);
  const dispatch = useAppDispatch();
  const [visibleCards, setVisibleCards] = useState<TRentalItem[]>(rentItems);

  useEffect(() => {
    dispatch(init());
  }, []);

  return (
    <div className="app">
      {rentItems.length > 0 && (
        <>
          <Map setVisibleCards={setVisibleCards} />
          <CardsList visibleCards={visibleCards} />
        </>
      )}

      {loading && <Loader />}

      <Snackbar
        open={error !== TError.NONE}
        autoHideDuration={5000}
        onClose={() => dispatch(actions.setError(TError.NONE))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default App
