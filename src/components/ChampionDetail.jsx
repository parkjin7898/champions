import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getChampionDetail } from '../api/champions';

const ChampionDetail = () => {
    const { englishName } = useParams();
    const { data: champion, isLoading, error } = useQuery({
        queryKey: ['champion', englishName],
        queryFn: () => getChampionDetail(englishName),
    });

    if (isLoading) return <div className="text-center text-white mt-10">로딩 중...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">에러 발생: {error.message}</div>;

    if (!champion) return <div className="text-center text-white mt-10">챔피언을 찾을 수 없습니다.</div>;

    const renderStars = (difficulty) => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <span key={i} className={`text-xl ${i <= difficulty ? 'text-yellow-400' : 'text-gray-600'}`}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const RadarChart = ({ attack, defense, magic }) => {
        const scale = 10;
        const center = 50;
        const radius = 30;

        const getPoint = (value, angle) => {
            const r = (value / 10) * radius;
            const x = center + r * Math.cos((angle * Math.PI) / 180);
            const y = center + r * Math.sin((angle * Math.PI) / 180);
            return `${x},${y}`;
        };

        const p1 = getPoint(attack, -90);
        const p2 = getPoint(magic, 30);
        const p3 = getPoint(defense, 150);

        return (
            <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                    {/* Background Triangle */}
                    <polygon points="50,20 76,65 24,65" fill="none" stroke="#4b5563" strokeWidth="1" />
                    <line x1="50" y1="50" x2="50" y2="20" stroke="#374151" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="76" y2="65" stroke="#374151" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="24" y2="65" stroke="#374151" strokeWidth="0.5" />

                    {/* Data Triangle */}
                    <polygon points={`${p1} ${p2} ${p3}`} fill="rgba(250, 204, 21, 0.5)" stroke="#facc15" strokeWidth="2" />

                    {/* Labels */}
                    <text x="50" y="15" textAnchor="middle" fill="#9ca3af" fontSize="8">공격 ({attack})</text>
                    <text x="85" y="75" textAnchor="middle" fill="#9ca3af" fontSize="8">마법 ({magic})</text>
                    <text x="15" y="75" textAnchor="middle" fill="#9ca3af" fontSize="8">방어 ({defense})</text>
                </svg>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 text-white max-w-5xl">
            <Link to="/" className="inline-block mb-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-bold transition-colors border border-gray-700">
                &larr; 목록으로
            </Link>

            <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                {/* Top Section: Portrait & Basic Info */}
                <div className="flex flex-col items-center pt-10 pb-6 bg-gradient-to-b from-gray-800 to-gray-900">
                    <div className="w-64 h-auto rounded-xl overflow-hidden shadow-2xl border-2 border-yellow-500/30 mb-6">
                        <img
                            src={`${champion.image.loadingImageUrl}`}
                            alt={champion.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = `${champion.image.url}`;
                            }}
                        />
                    </div>

                    <div className="text-center px-4">
                        <h2 className="text-xl text-yellow-500 font-bold tracking-[0.2em] uppercase mb-2 text-shadow-lg">{champion.title}</h2>
                        <h1 className="text-5xl font-black mb-4 text-white drop-shadow-2xl">{champion.name}</h1>
                        <div className="flex justify-center gap-2 mb-4">
                            {champion.tags && champion.tags.map(tag => (
                                <span key={tag} className="px-4 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 rounded-full text-sm font-bold backdrop-blur-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column: Stats & Graph */}
                    <div className="space-y-8">
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                            <h3 className="text-xl font-bold mb-6 text-center text-gray-200">능력치 분석</h3>
                            <RadarChart
                                attack={champion.info?.attack || 0}
                                defense={champion.info?.defense || 0}
                                magic={champion.info?.magic || 0}
                            />
                            <div className="mt-6 text-center">
                                <div className="text-gray-400 text-sm mb-2">난이도</div>
                                <div className="flex justify-center gap-1">
                                    {renderStars(champion.info?.difficulty || 0)}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                            <h3 className="text-xl font-bold mb-4 text-gray-200">상세 스탯</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">체력 (HP)</span>
                                    <span className="font-mono text-yellow-100">{champion.stats?.hp}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">마나 (MP)</span>
                                    <span className="font-mono text-blue-100">{champion.stats?.mp}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">공격력</span>
                                    <span className="font-mono text-red-100">{champion.stats?.attackdamage}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">공격 속도</span>
                                    <span className="font-mono text-orange-100">{champion.stats?.attackspeed}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">방어력</span>
                                    <span className="font-mono text-green-100">{champion.stats?.armor}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">마법 저항력</span>
                                    <span className="font-mono text-purple-100">{champion.stats?.spellblock}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">이동 속도</span>
                                    <span className="font-mono text-white">{champion.stats?.movespeed}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">사거리</span>
                                    <span className="font-mono text-white">{champion.stats?.attackrange}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Lore */}
                    <div className="flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-6 text-yellow-400 border-l-4 border-yellow-500 pl-4">배경 이야기</h3>
                        <p className="text-gray-300 text-lg leading-loose font-light tracking-wide">
                            {champion.blurb}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChampionDetail;
