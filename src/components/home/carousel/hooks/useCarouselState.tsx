
import { useState, useCallback, useEffect } from "react";
import { CarouselItem } from "../types";

interface UseCarouselStateProps {
  data: CarouselItem[];
  api: any | null;
  isInView: boolean;
}

export const useCarouselState = ({ data, api, isInView }: UseCarouselStateProps) => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null);

  // Update current slide index when the carousel changes
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Select an item for the modal
  const handleItemSelect = useCallback((item: CarouselItem, index: number) => {
    setSelectedItem(item);
    setCurrent(index);
    setModalOpen(true);
    setAutoPlay(false); // Pause autoplay when modal is open
  }, []);

  // Close the modal
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
    
    if (isInView) {
      setAutoPlay(true);
    }
  }, [isInView]);

  // Navigate to the next item in the modal
  const handleNext = useCallback(() => {
    if (!data) return;
    const nextIndex = (current + 1) % data.length;
    setCurrent(nextIndex);
    setSelectedItem(data[nextIndex]);
    api?.scrollTo(nextIndex);
  }, [api, current, data]);

  // Navigate to the previous item in the modal
  const handlePrevious = useCallback(() => {
    if (!data) return;
    const prevIndex = (current - 1 + data.length) % data.length;
    setCurrent(prevIndex);
    setSelectedItem(data[prevIndex]);
    api?.scrollTo(prevIndex);
  }, [api, current, data]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (modalOpen) return; // Don't handle keyboard events when modal is open
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
      case 'Home':
        e.preventDefault();
        api?.scrollTo(0);
        break;
      case 'End':
        e.preventDefault();
        api?.scrollTo(data.length - 1);
        break;
    }
  }, [api, data?.length, handleNext, handlePrevious, modalOpen]);

  return {
    current,
    autoPlay,
    modalOpen,
    selectedItem,
    setCurrent,
    setAutoPlay,
    handleItemSelect,
    handleModalClose,
    handleNext,
    handlePrevious,
    handleKeyDown
  };
};
