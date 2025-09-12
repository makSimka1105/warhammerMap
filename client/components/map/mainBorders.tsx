import React from 'react';
import styles from '@/app/styles/borders.module.scss'; // Import the CSS file for styling




const BorderComponent: React.FC<{isVisible:boolean}> = ({isVisible}) => {
  return (
    <div className={styles.container}>
      <img className={[styles.border,!isVisible&&styles.hidden].join(' ')} src={'/assets/borders/borders.png'}  />
      <img className={[styles.segment,styles['container-obscurus'],!isVisible&&styles.hidden].join(' ')}  src={'/assets/borders/segments_obscurus.png'}  />
      <img className={[styles.segment,styles['container-pacificus'],!isVisible&&styles.hidden].join(' ')}  src={'/assets/borders/segments_pacificus.png'}  />
      <img className={[styles.segment,styles['container-tempestus'],!isVisible&&styles.hidden].join(' ')} src={'/assets/borders/segments_tempestus.png'} />
      <img  className={[styles.segment,styles['container-ultima'],!isVisible&&styles.hidden].join(' ')} src={'/assets/borders/segments_ultima.png'}/>
      <img className={[styles.segment,styles['container-solar'],!isVisible&&styles.hidden].join(' ')} src={'/assets/borders/solar.png'}  />


    </div>
  );
};

export default BorderComponent;
