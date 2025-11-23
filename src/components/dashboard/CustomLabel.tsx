export function CustomLabel(props: any) {
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const entry = props.data[index];
    const lines = entry.name.split(' ');

    return (
        <g>
            <text x={x} y={y - 18} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fill="#4a3629" fontSize="13px" fontWeight="500">
                {lines[0]}
            </text>
            <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fill="#4a3629" fontSize="13px" fontWeight="500">
                {lines[1]}
            </text>
            <text x={x} y={y + 18} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fill="#a16535" fontSize="14px" fontWeight="600">
                {`${entry.value} processo${entry.value > 1 ? 's' : ''} (${(percent * 100).toFixed(0)}%)`}
            </text>
        </g>
    );
};

// ---------- TOOLTIP CUSTOMIZADO (SEM value:) ----------
export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-[#d4c4b0] rounded-lg shadow-lg">
                <p className="text-[#2d1f16] font-semibold text-sm">{label}</p>
                <p className="text-[#a16535] font-medium text-sm">
                    {payload[0].value} processo{payload[0].value > 1 ? 's' : ''}
                </p>
            </div>
        );
    }
    return null;
};