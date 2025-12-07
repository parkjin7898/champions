import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChampions } from '../api/champions';
import { Link } from 'react-router-dom';

const ChampionList = () => {
    const [sortBy, setSortBy] = React.useState('name');
    const [searchTerm, setSearchTerm] = React.useState('');

    const { data: champions, isLoading, error } = useQuery({
        queryKey: ['champions'],
        queryFn: getChampions,
    });

    const sortedChampions = React.useMemo(() => {
        if (!champions) return [];

        let filtered = champions;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = champions.filter(champion =>
                champion.name.includes(searchTerm) ||
                champion.englishName.toLowerCase().includes(lowerTerm)
            );
        }

        if (sortBy === 'name') {
            return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'tag') {
            const grouped = {};
            filtered.forEach(champion => {
                const tag = champion.tags && champion.tags[0] ? champion.tags[0] : '기타';
                if (!grouped[tag]) grouped[tag] = [];
                grouped[tag].push(champion);
            });

            Object.keys(grouped).forEach(tag => {
                grouped[tag].sort((a, b) => a.name.localeCompare(b.name));
            });

            const sortedKeys = Object.keys(grouped).sort();
            const sortedGrouped = {};
            sortedKeys.forEach(key => {
                sortedGrouped[key] = grouped[key];
            });

            return sortedGrouped;
        }
        return [];
    }, [champions, sortBy, searchTerm]);

    if (isLoading) return <div className="text-center text-white mt-10">로딩 중...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">에러 발생: {error.message}</div>;

    return (
        <div className="w-full px-4 md:px-8 lg:px-12 py-8">
            <h1 className="text-4xl font-bold text-center text-gold-500 mb-10 text-yellow-400 tracking-wider">리그 오브 레전드 챔피언</h1>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-1/2 lg:w-1/3">
                    <input
                        type="text"
                        placeholder="챔피언 이름 검색 (한국어/영어)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none placeholder-gray-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy('name')}
                        className={`px-4 py-2 rounded font-bold transition-colors ${sortBy === 'name' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        이름순
                    </button>
                    <button
                        onClick={() => setSortBy('tag')}
                        className={`px-4 py-2 rounded font-bold transition-colors ${sortBy === 'tag' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        역할순
                    </button>
                </div>
            </div>

            {sortBy === 'tag' ? (
                Object.entries(sortedChampions).map(([tag, championsInTag]) => (
                    <div key={tag} className="mb-12">
                        <h2 className="text-2xl font-bold text-yellow-400 mb-6 border-b border-gray-700 pb-2 pl-2">
                            {tag} <span className="text-sm text-gray-500 font-normal ml-2">({championsInTag.length})</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4 md:gap-6">
                            {championsInTag.map((champion) => {
                                return (
                                    <Link key={champion.id} to={`/${champion.englishName}`} className="group">
                                        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-yellow-400">
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion.image.full}`}
                                                    alt={champion.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-3 text-center">
                                                <h2 className="text-lg font-bold text-gray-100 group-hover:text-yellow-400 truncate">{champion.name}</h2>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4 md:gap-6">
                    {sortedChampions.map((champion) => {
                        return (
                            <Link key={champion.id} to={`/${champion.englishName}`} className="group">
                                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-yellow-400">
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion.image.full}`}
                                            alt={champion.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-3 text-center">
                                        <h2 className="text-lg font-bold text-gray-100 group-hover:text-yellow-400 truncate">{champion.name}</h2>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChampionList;
