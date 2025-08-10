import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Item, ListApiResponse } from '@/types/cardList';

interface ListState {
  items: Item[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  itemsPerPage: number;
  loadingMode: 'pagination' | 'infinite';
  hasMore: boolean;
}

const initialState: ListState = {
  items: [],
  loading: true,
  error: null,
  page: 1,
  total: 0,
  itemsPerPage: 10,
  loadingMode: 'pagination',
  hasMore: true,
};

export const fetchList = createAsyncThunk(
  'list/fetchList',
  async (params: { page: number; itemsPerPage?: number }, { rejectWithValue }) => {
    const { page, itemsPerPage = 10 } = params;

    try {
      const res = await fetch(
        `https://api-test.rtbpanda.tech/list?page=${page}&itemsPerPage=${itemsPerPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000), 
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Некорректная структура данных');
      }

      return data as ListApiResponse;
    } catch (error: unknown) {
      let errorMessage = 'Неизвестная ошибка';

      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          errorMessage = 'Превышено время ожидания запроса';
        } else if (error.name === 'AbortError') {
          errorMessage = 'Запрос был отменен';
        } else {
          errorMessage = error.message;
        }
      }

      return rejectWithValue(errorMessage);
    }
  },
);

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    appendItems: (state, action: PayloadAction<Item[]>) => {
      state.items = [...state.items, ...action.payload];
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.page = 1; 
      state.items = []; 
    },
    setLoadingMode: (state, action: PayloadAction<'pagination' | 'infinite'>) => {
      state.loadingMode = action.payload;
      state.page = 1;
      state.items = []; 
      
      if (action.payload === 'infinite') {
        state.itemsPerPage = 10;
      }
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchList.fulfilled, (state, action) => {
        state.loading = false;

        if (state.loadingMode === 'infinite' && state.page > 1) {
          state.items = [...state.items, ...action.payload.data];
        } else {
          state.items = action.payload.data;
        }

        state.total = action.payload.meta.count;
        state.hasMore = action.payload.data.length === state.itemsPerPage;
      })
      .addCase(fetchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setItems,
  appendItems,
  setPage,
  setItemsPerPage,
  setLoadingMode,
  setHasMore,
} = listSlice.actions;

export default listSlice.reducer;
