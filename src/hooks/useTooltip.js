import { useState, useRef, useCallback, useEffect } from 'react';
import { getAdminRetailerDetails, getAdminProductDetails, getAdminSalesmanDetails } from '../utils/api';

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState({
    isVisible: false,
    content: null,
    position: { x: 0, y: 0 },
    isLoadingTarget: false,
    fetchError: null,
    dataReadyForDisplay: false,
    hoverTargetInfo: null
  });

  const fetchDataDelayTimerRef = useRef(null);
  const showTooltipDelayTimerRef = useRef(null);
  const currentFetchControllerRef = useRef(null);
  const hoverStartTimeRef = useRef(null);
  const tooltipHoverTargetInfoRef = useRef();

  const handleCellMouseLeave = useCallback(() => {
    clearTimeout(fetchDataDelayTimerRef.current);
    clearTimeout(showTooltipDelayTimerRef.current);
    if (currentFetchControllerRef.current) {
      currentFetchControllerRef.current.abort();
      currentFetchControllerRef.current = null;
    }
    setTooltip({
      isVisible: false,
      content: null,
      position: { x: 0, y: 0 },
      isLoadingTarget: false,
      fetchError: null,
      dataReadyForDisplay: false,
      hoverTargetInfo: null
    });
    hoverStartTimeRef.current = null;
  }, []);

  const handleCellMouseEnter = useCallback((event, columnName, viewName, itemData) => {
    handleCellMouseLeave();
    hoverStartTimeRef.current = Date.now();

    let targetType = null;
    let itemId = null;

    if (viewName === 'SALES') {
      if (columnName === 'Retailer') {
        targetType = 'Retailer';
        itemId = typeof itemData.retailer === 'object' && itemData.retailer !== null ? itemData.retailer._id : itemData.retailer;
      } else if (columnName === 'Product') {
        targetType = 'Product';
        itemId = typeof itemData.product === 'object' && itemData.product !== null ? itemData.product._id : itemData.product;
      } else if (columnName === 'Added By') {
        targetType = 'Salesman';
        itemId = typeof itemData.addedBy === 'object' && itemData.addedBy !== null ? itemData.addedBy._id : itemData.addedBy;
      }
    }

    if (!targetType || !itemId) return;

    const currentTarget = { type: targetType, id: itemId, columnName, viewName };
    setTooltip(prev => ({ ...prev, position: { x: event.clientX, y: event.clientY }, hoverTargetInfo: currentTarget }));

    fetchDataDelayTimerRef.current = setTimeout(async () => {
      if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) {
        return;
      }

      setTooltip(prev => ({ ...prev, isLoadingTarget: true, content: `Loading ${targetType.toLowerCase()}...` }));
      currentFetchControllerRef.current = new AbortController();
      const { signal } = currentFetchControllerRef.current;
      let details;
      let fetchError = null;

      try {
        if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) {
          setTooltip(prev => prev.hoverTargetInfo?.id === itemId && prev.hoverTargetInfo?.type === targetType ? { ...prev, isLoadingTarget: false } : prev);
          return;
        }

        switch (targetType) {
          case 'Retailer':
            details = await getAdminRetailerDetails(itemId, { signal });
            break;
          case 'Product':
            details = await getAdminProductDetails(itemId, { signal });
            break;
          case 'Salesman':
            details = await getAdminSalesmanDetails(itemId, { signal });
            break;
          default:
            throw new Error('Unknown target type for tooltip');
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setTooltip(prev => prev.hoverTargetInfo?.id === itemId && prev.hoverTargetInfo?.type === targetType ? { ...prev, isLoadingTarget: false } : prev);
          return;
        }
        console.error(`Error fetching ${targetType} details for tooltip (ID: ${itemId}):`, err);
        fetchError = err.message || `Error loading ${targetType.toLowerCase()} details`;
      }

      if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) return;

      let newContent = '';
      if (fetchError) {
        newContent = fetchError;
      } else if (details) {
        if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) {
          setTooltip(prev => prev.hoverTargetInfo?.id === itemId && prev.hoverTargetInfo?.type === targetType ? { ...prev, isLoadingTarget: false } : prev);
          return;
        }
        newContent = JSON.stringify(details, null, 2);
      } else {
        newContent = 'No details found or an unexpected error occurred.';
      }

      setTooltip(prev => {
        if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) return prev;

        const newState = {
          ...prev,
          isLoadingTarget: false,
          content: newContent,
          fetchError: fetchError,
          dataReadyForDisplay: true
        };
        const elapsedTime = Date.now() - (hoverStartTimeRef.current || Date.now());
        if (elapsedTime >= 1500) {
          newState.isVisible = true;
        }
        return newState;
      });

    }, 100);

    showTooltipDelayTimerRef.current = setTimeout(() => {
      setTooltip(prev => {
        if (tooltipHoverTargetInfoRef.current?.id === itemId &&
            tooltipHoverTargetInfoRef.current?.type === targetType &&
            prev.hoverTargetInfo?.id === itemId &&
            prev.hoverTargetInfo?.type === targetType &&
            prev.dataReadyForDisplay &&
            !prev.isLoadingTarget) {
          return { ...prev, isVisible: true };
        }
        return prev;
      });
    }, 1500);

  }, [handleCellMouseLeave]);

  useEffect(() => {
    tooltipHoverTargetInfoRef.current = tooltip.hoverTargetInfo;
  }, [tooltip.hoverTargetInfo]);

  return {
    tooltip,
    handleCellMouseEnter,
    handleCellMouseLeave
  };
}; 