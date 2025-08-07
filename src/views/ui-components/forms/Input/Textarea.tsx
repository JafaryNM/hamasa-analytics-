import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    maxWords?: number;
    showWordCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ value = '', onChange, placeholder, className = '', maxWords, showWordCount = true, ...props }, ref) => {
        const [wordCount, setWordCount] = React.useState(0);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const text = e.target.value;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

            if (!maxWords || words <= maxWords) {
                setWordCount(words);
                if (onChange) onChange(e);
            }
        };

        return (
            <div className="relative">
                <textarea
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    {...props}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                        resize-none min-h-[150px] ${className}`}
                />
                {showWordCount && (
                    <p className="text-right text-sm text-gray-500 mt-1">
                        {wordCount} {wordCount === 1 ? "word" : "words"}
                        {maxWords ? ` / ${maxWords} max` : ""}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
