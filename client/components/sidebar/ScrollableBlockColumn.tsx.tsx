import React, { useMemo } from "react";
import styles from "@/app/styles/scrolable.module.scss";
import { IEvent } from "@/app/types/event";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Определение интерфейса для пропсов
interface ScrollableBlockColumnProps {
    description: string | null;
    events: IEvent[] | null;
    isLoading?: boolean;
}

const ScrollableBlockColumn: React.FC<ScrollableBlockColumnProps> = ({
    description,
    events,
    isLoading = false,
}) => {
    // Memoize the description section to prevent unnecessary re-renders
    const descriptionSection = useMemo(() => {
        if (description) {
            return (
                <div className={styles.description}>
                    <p
                        className={styles.descriptionTitle}
                        style={{ marginBottom: 0 }}
                    >
                        описание
                    </p>
                    <p style={{ marginBottom: 0, marginTop: 0 }}>
                        {description}
                    </p>
                </div>
            );
        }
        return (
            <div className={styles.noData}>
                <p>данные описания отсутствуют</p>
            </div>
        );
    }, [description]);

    // Memoize the events section
    const eventsSection = useMemo(() => {
        if (isLoading) {
            return (
                <div style={{ padding: "20px" }}>
                    <LoadingSpinner
                        size="medium"
                        text="Загрузка событий..."
                        color="#4299e1"
                    />
                </div>
            );
        }

        if (events && events.length > 0) {
            return events.map((event, index) => (
                <div
                    key={event._id || index}
                    className={styles.event}
                    style={{ width: "90%" }}
                >
                    <p
                        className={styles.eventTitle}
                        style={{ marginBottom: 0 }}
                    >
                        {event?.name}
                    </p>
                    {/* <ImageGridPreview images={event?.shots} maxHeight={200}/> */}
                    <p style={{ marginBottom: 0 }}>{event?.description}</p>
                </div>
            ));
        }
        return (
            <div className={styles.noData}>
                <p>данные о событиях отсутствуют</p>
            </div>
        );
    }, [events, isLoading]);

    // Memoize the entire component render to prevent unnecessary re-renders
    const memoizedContent = useMemo(() => {
        return (
            <div className={styles.scrollWrapper}>
                {descriptionSection}
                {eventsSection}
            </div>
        );
    }, [descriptionSection, eventsSection]);

    return memoizedContent;
};

export default ScrollableBlockColumn;
