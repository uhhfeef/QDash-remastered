export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="stats-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-1/4">
            <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                <div>{children}</div>
            </div>
        </div>
    );
}