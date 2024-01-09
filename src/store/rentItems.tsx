import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TError, TRentalItem, TState } from "../types";
import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase.tsx";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const initialState: TState = {
  rentItems: [],
  loading: false,
  error: TError.NONE,
};

const rentalItemsCollectionRef = collection(db, "rental-items");

async function geocodeAddress(address: string) {
  const nominatimEndpoint = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: address,
    format: 'json',
  };

  try {
    const response = await axios.get(nominatimEndpoint, { params });
    if (response.data && response.data.length > 0) {
      const result = response.data[0];

      return [[parseFloat(result.lat), parseFloat(result.lon)], result.display_name];
    } else {
      new Error('No results found for the given address');
    }
  } catch {
    throw new Error('Error geocoding address');
  }
}

const handleUploadImage = async (image: File | null) => {
  if (image) {
    const imageRef = ref(storage, `images/${image.name + v4()}`);

    await uploadBytes(imageRef, image);

    return await getDownloadURL(imageRef);
  }

  return;
}

export const init = createAsyncThunk('rentItems/fetch', async () => {
  const data = await getDocs(rentalItemsCollectionRef);

  return data.docs.map(doc => ({
    address: "",
    latLng: [0, 0],
    imgUrl: "",
    id: doc.id,
    description: "",
    ...doc.data(),
  }));
});

export const addNew = createAsyncThunk('addRentItem/fetch', async (rentItemsData: { address: string, uploadedImage: File | null, description: string }) => {
  const imgUrl = await handleUploadImage(rentItemsData.uploadedImage);
  const coords = await geocodeAddress(rentItemsData.address);
  const querySnapshot = await getDocs(rentalItemsCollectionRef);
  const exists = querySnapshot.docs.some(doc => doc.data().address === rentItemsData.address);

  if (exists) {
    console.error('Data with this address already exists in the database.');
    return;
  }

  if (!imgUrl || !coords) {
    return
  }

  const newData = {
    address: coords[1],
    latLng: coords[0],
    imgUrl,
    description: rentItemsData.description,
  };

  const docRef = await addDoc(rentalItemsCollectionRef, newData);
  const docSnapshot = await getDoc(docRef);

  return { address: "", latLng: [0, 0], id: docSnapshot.id, imgUrl: imgUrl, description: "",  ...docSnapshot.data() };
});

const rentItemsSlice = createSlice({
  name: 'rental-items',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<TRentalItem[]>) => {
      return { ...state, rentItems: action.payload };
    },
    setError: (state, action) => {
      return { ...state, error: action.payload };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(init.pending, (state) => {
      return ({ ...state, loading: true });
    });

    builder.addCase(init.fulfilled, (state, action) => {
      return ({ ...state, rentItems: action.payload, loading: false });
    });

    builder.addCase(init.rejected, (state) => {
      return ({ ...state, error: TError.LOAD_RENT_ITEMS, loading: false });
    });

    builder.addCase(addNew.pending, (state) => {
      return ({ ...state, loading: true });
    });

    builder.addCase(addNew.fulfilled, (state, action) => {
      if (action.payload) {
        return ({ ...state, rentItems: [...state.rentItems, action.payload], loading: false });
      }
    });

    builder.addCase(addNew.rejected, (state) => {
      return ({ ...state, error: TError.ADD_RENT_ITEMS, loading: false });
    });
  },
});

export default rentItemsSlice;
export const { actions } = rentItemsSlice;
