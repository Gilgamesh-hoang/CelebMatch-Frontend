import {Button, Form, Input, Tag, message, Space} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {SearchFormType, SearchResultType} from "../../types/search-form.type.ts";
import {useState} from "react";
import http from "../../utils/http.ts";

const { TextArea } = Input;

interface Props {
    setResult: (data: SearchResultType) => void;
    setIsSearching: (isSearching: boolean) => void;
}

const SearchForm = ({setResult, setIsSearching}: Props) => {
    const [form] = Form.useForm<SearchFormType>();
    const [songs, setSongs] = useState<string[]>([]);
    const [inputSong, setInputSong] = useState('');
    const [awards, setAwards] = useState<string[]>([]);
    const [inputAward, setInputAward] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const addSongTag = () => {
        const song = inputSong.trim();
        if (song && !songs.includes(song)) {
            const newSongs = [...songs, song];
            setSongs(newSongs);
            form.setFieldsValue({ songs: newSongs });
        }
        setInputSong('');
    };

    const addAwardTag = () => {
        const award = inputAward.trim();
        if (award && !awards.includes(award)) {
            const newAwards = [...awards, award];
            setAwards(newAwards);
            form.setFieldsValue({ awards: newAwards });
        }
        setInputAward('');
    };

    const handleKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>, target: 'SONG' | 'AWARD') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (target === 'SONG') {
                addSongTag();
            }

            if (target === 'AWARD') {
                addAwardTag();
            }
        }
    };

    const removeSongTag = (removedSong: string) => {
        const newSongs = songs.filter(song => song !== removedSong);
        setSongs(newSongs);
        form.setFieldsValue({ songs: newSongs });
    };

    const removeAwardTag = (removedAward: string) => {
        const newAwards = awards.filter(award => award !== removedAward);
        setAwards(newAwards);
        form.setFieldsValue({ awards: newAwards });
    };

    const onFinish = async (body: SearchFormType) => {
        const hasAtLeastOne =
            (body.songs && body.songs.length > 0) ||
            (body.awards && body.awards.length > 0) ||
            (body.bio && body.bio.trim() !== '');

        if (!hasAtLeastOne) {
            messageApi.error("Phải điền ít nhất một trong các trường: Bài hát, Giải thưởng hoặc Tiểu sử")
            return;
        }

        const response = await http.post<SearchResultType>('/search', body)
        if (response){
            setIsSearching(false);
            setResult(response.data);
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                form={form}
                initialValues={{
                    songs: [],
                    awards: [],
                    bio: ''
                }}
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
                className="col-span-2 shadow-md p-6"
            >

                <Form.Item
                    label="Bài hát"
                    name="songs"
                >
                    <Input
                        value={inputSong}
                        onChange={(e) => setInputSong(e.target.value)}
                        onKeyDown={(e) => handleKeyDownEnter(e, 'SONG')}
                    />
                    {
                        songs.length > 0 &&
                        <Space wrap size={[1,6]} className="p-2 mt-2 border rounded-lg flex">
                            {
                                songs.map(song => (
                                    <Tag key={song} closable onClose={() => removeSongTag(song)}>{song}</Tag>
                                ))
                            }
                        </Space>
                    }
                </Form.Item>

                <Form.Item
                    label="Giải thương"
                    name="awards"
                >
                    <Input
                        value={inputAward}
                        onChange={(e) => setInputAward(e.target.value)}
                        onKeyDown={(e) => handleKeyDownEnter(e, 'AWARD')}
                    />
                    {
                        awards.length > 0 &&
                        <Space wrap size={[1,6]} className="p-2 mt-2 border rounded-lg flex">
                            {
                                awards.map(award => (
                                    <Tag key={award} closable onClose={() => removeAwardTag(award)}>{award}</Tag>
                                ))
                            }
                        </Space>
                    }
                </Form.Item>

                <Form.Item
                    label="Tiểu sử"
                    name="bio"
                >
                    <TextArea rows={8}/>
                </Form.Item>

                <Form.Item
                    className="mb-0"
                    extra={<>Phải điền ít nhất một trong các trường: Bài hát, Giải thưởng hoặc Tiểu sử</>}
                >
                    <Button type="primary" className="w-full mb-2" htmlType="submit">
                        Tìm kiếm<SearchOutlined />
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
export default SearchForm
