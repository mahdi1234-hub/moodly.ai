import { create } from "zustand";

interface SlideData {
  id: string;
  order: number;
  content: string;
  layout: string;
  background?: string;
  transition: string;
  notes?: string;
}

interface PresentationState {
  currentSlideIndex: number;
  slides: SlideData[];
  isPresenting: boolean;
  isSaving: boolean;
  setCurrentSlide: (index: number) => void;
  setSlides: (slides: SlideData[]) => void;
  addSlide: (slide: SlideData) => void;
  updateSlide: (index: number, data: Partial<SlideData>) => void;
  removeSlide: (index: number) => void;
  reorderSlides: (from: number, to: number) => void;
  setPresenting: (val: boolean) => void;
  setSaving: (val: boolean) => void;
}

export const usePresentationStore = create<PresentationState>((set) => ({
  currentSlideIndex: 0,
  slides: [],
  isPresenting: false,
  isSaving: false,
  setCurrentSlide: (index) => set({ currentSlideIndex: index }),
  setSlides: (slides) => set({ slides }),
  addSlide: (slide) => set((s) => ({ slides: [...s.slides, slide] })),
  updateSlide: (index, data) =>
    set((s) => ({
      slides: s.slides.map((sl, i) => (i === index ? { ...sl, ...data } : sl)),
    })),
  removeSlide: (index) =>
    set((s) => ({ slides: s.slides.filter((_, i) => i !== index) })),
  reorderSlides: (from, to) =>
    set((s) => {
      const slides = [...s.slides];
      const [moved] = slides.splice(from, 1);
      slides.splice(to, 0, moved);
      return { slides };
    }),
  setPresenting: (val) => set({ isPresenting: val }),
  setSaving: (val) => set({ isSaving: val }),
}));
