import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import { IResume, IResumeStats } from '../types';

interface ResumeState {
  resumes: IResume[];
  selectedResume: IResume | null;
  stats: IResumeStats | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  searchQuery: string;
  roleFilter: string;
}

const initialState: ResumeState = {
  resumes: [],
  selectedResume: null,
  stats: null,
  loading: false,
  actionLoading: false,
  error: null,
  searchQuery: '',
  roleFilter: 'All Roles',
};

export const fetchResumes = createAsyncThunk(
  'resumes/fetchResumes',
  async (params: { search?: string; role?: string } | void, { rejectWithValue }) => {
    try {
      const response = await api.get('/resumes', { params: params || undefined });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch resumes');
    }
  }
);

export const fetchResumeStats = createAsyncThunk(
  'resumes/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/resumes/stats');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resumes/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resumes/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch resume');
    }
  }
);

export const createResume = createAsyncThunk(
  'resumes/create',
  async (resumeData: Partial<IResume>, { rejectWithValue }) => {
    try {
      const response = await api.post('/resumes', resumeData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create resume');
    }
  }
);

export const updateResume = createAsyncThunk(
  'resumes/update',
  async ({ id, resumeData }: { id: string; resumeData: Partial<IResume> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/resumes/${id}`, resumeData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update resume');
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resumes/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/resumes/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete resume');
    }
  }
);

export const bulkDeleteResumes = createAsyncThunk(
  'resumes/bulkDelete',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await api.post('/resumes/bulk-delete', { ids });
      return ids;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete resumes');
    }
  }
);

export const incrementDownload = createAsyncThunk(
  'resumes/incrementDownload',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/resumes/${id}/increment-download`);
      return { id, downloadsCount: res.data.downloadsCount };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update download');
    }
  }
);

const resumeSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
    },
    setSelectedResume: (state, action: PayloadAction<IResume | null>) => {
      state.selectedResume = action.payload;
    },
    clearSelectedResume: (state) => {
      state.selectedResume = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Resumes
    builder.addCase(fetchResumes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchResumes.fulfilled, (state, action: PayloadAction<IResume[]>) => {
      state.loading = false;
      state.resumes = action.payload;
    });
    builder.addCase(fetchResumes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Stats
    builder.addCase(fetchResumeStats.fulfilled, (state, action: PayloadAction<IResumeStats>) => {
      state.stats = action.payload;
    });

    // Fetch Resume By Id
    builder.addCase(fetchResumeById.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(fetchResumeById.fulfilled, (state, action: PayloadAction<IResume>) => {
      state.actionLoading = false;
      state.selectedResume = action.payload;
    });
    builder.addCase(fetchResumeById.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Create Resume
    builder.addCase(createResume.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(createResume.fulfilled, (state, action: PayloadAction<IResume>) => {
      state.actionLoading = false;
      state.resumes.unshift(action.payload);
      state.selectedResume = action.payload;
    });
    builder.addCase(createResume.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Update Resume
    builder.addCase(updateResume.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(updateResume.fulfilled, (state, action: PayloadAction<IResume>) => {
      state.actionLoading = false;
      const index = state.resumes.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.resumes[index] = action.payload;
      }
      state.selectedResume = action.payload;
    });
    builder.addCase(updateResume.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Delete Resume
    builder.addCase(deleteResume.fulfilled, (state, action: PayloadAction<string>) => {
      state.resumes = state.resumes.filter((r) => r._id !== action.payload);
      if (state.selectedResume?._id === action.payload) {
        state.selectedResume = null;
      }
    });

    // Bulk Delete Resumes
    builder.addCase(bulkDeleteResumes.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.resumes = state.resumes.filter((r) => !action.payload.includes(r._id));
    });

    // Increment Download
    builder.addCase(incrementDownload.fulfilled, (state, action) => {
      const resume = state.resumes.find((r) => r._id === action.payload.id);
      if (resume) {
        resume.downloadsCount = action.payload.downloadsCount;
      }
      if (state.stats) {
        state.stats.totalDownloads += 1;
      }
    });
  },
});

export const { setSearchQuery, setRoleFilter, setSelectedResume, clearSelectedResume } =
  resumeSlice.actions;
export default resumeSlice.reducer;
