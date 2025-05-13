'use client';

import React from 'react';
import styles from './Spinner.module.css';


export default function Spinner() {
  return (
    <div className="spinner-wrapper" role="status">
      <div className="loader" />
    </div>
  );
}