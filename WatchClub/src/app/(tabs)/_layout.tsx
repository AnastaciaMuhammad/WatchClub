import React from 'react';
import AppTabs from '@/components/app-tabs';

export default function TabsLayout() {
  // This file acts as the wrapper for home, find, create, etc.
  // It injects your AppTabs (the nav bar) into those screens.
  return <AppTabs />;
}