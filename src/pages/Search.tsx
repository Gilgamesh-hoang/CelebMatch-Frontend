import SearchForm from "../component/form/SearchForm.tsx";
import {Empty, Spin, Tabs} from "antd";
import {useState} from "react";
import {SearchResultType} from "../types/search-form.type.ts";

const Search = () => {
    const [result, setResult] = useState<SearchResultType | null>(null);
    const [isSearching, setIsSearching] = useState<null | boolean>(null);

    return (
        <div className="grid grid-cols-6 items-start">
            <SearchForm setResult={setResult} setIsSearching={setIsSearching} />
            <div className="grid col-span-4 space-y-4 ml-4 h-full">
                {
                    result ? (
                        isSearching ? <Spin/> : (
                            result.length ? (
                                <div className="grid">
                                    <div className="justify-self-end text-lg">Tìm thấy <strong>{result.length}</strong> phù hợp</div>
                                    <Tabs
                                        tabPosition="left"
                                        items={result.map((item) => {
                                            return {
                                                label: item.full_name,
                                                key: item.id,
                                                children: (
                                                    <div className="bg-white overflow-hidden py-4">
                                                        <div className="grid grid-cols-4 gap-6">
                                                            <div className="justify-self-center">
                                                                {item.full_name && item.image ? (
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.full_name || "Artist image"}
                                                                        className="w-40 h-40 object-cover rounded-full border-4 border-indigo-100 shadow"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none"
                                                                             viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="col-span-3">
                                                                <div className="space-y-4 text-gray-700">
                                                                    {item.birth_date && (
                                                                        <div className="flex items-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500"
                                                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                                            </svg>
                                                                            <span className="font-medium">Ngày sinh:</span>
                                                                            <span className="ml-2">{new Date(item.birth_date).toDateString()}</span>
                                                                        </div>
                                                                    )}

                                                                    {item.biography && (
                                                                        <div>
                                                                            <div className="flex items-center mb-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                     className="h-5 w-5 mr-2 text-indigo-500" fill="none"
                                                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                                                </svg>
                                                                                <h4 className="font-medium">Tiểu sử</h4>
                                                                            </div>
                                                                            <p className="text-sm text-gray-600 leading-relaxed">{stripHtml(item.biography)}</p>
                                                                        </div>
                                                                    )}

                                                                    {item.songs && (
                                                                        <div>
                                                                            <div className="flex items-center mb-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                     className="h-5 w-5 mr-2 text-indigo-500" fill="none"
                                                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                                                                                </svg>
                                                                                <h4 className="font-medium">Các bài hát nổi bật</h4>
                                                                            </div>
                                                                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                                                                                {item.songs.map((song, index) => (
                                                                                    <li key={index}>{song}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {item.awards && (
                                                                        <div>
                                                                            <div className="flex items-center mb-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                     className="h-5 w-5 mr-2 text-indigo-500" fill="none"
                                                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                                                                                </svg>
                                                                                <h4 className="font-medium">Giải thưởng</h4>
                                                                            </div>
                                                                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                                                                                {item.awards.map((award, index) => (
                                                                                    <li key={index}>{stripHtml(award)}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    />
                                </div>
                            ) : <Empty >Không tìm thấy kết quả nào phù hợp</Empty>
                        )
                    ) : <div className="text-center place-content-center text-lg">Kết quả tìm kiếm sẽ hiển thị ở đây</div>
                }
            </div>

        </div>
    )
}

const stripHtml = (html: string | undefined): string => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};
export default Search
