interface SliderProps {
    total: number;
    completed: number;
}

const Slider = ({ total, completed }: SliderProps) => {
    const progress = total > 0 ? (completed / total) * 100 : 100;

    return (
        <div className="flex w-full h-2 gap-0.5">
            <div
                className="flex h-full bg-green-400 rounded-full"
                style={{
                    width: `${progress}%`,
                }}
            />

            <div
                className="flex h-full bg-gray-700 rounded-full"
                style={{
                    width: `${100 - progress}%`,
                }}
            />
        </div>
    );
};

export default Slider;
