'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Play, Eye, ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  publishDate: string;
  category: string;
  author: string;
}

const mockVideos: Video[] = [
  {
    id: 1,
    title: "Hướng dẫn sử dụng ứng dụng DW Manager",
    description: "Video hướng dẫn chi tiết cách sử dụng tất cả tính năng của ứng dụng DW Manager...",
    thumbnail: "/api/placeholder/400/225",
    duration: "10:30",
    views: 5200,
    publishDate: "2024-03-14",
    category: "Hướng dẫn",
    author: "DW Team"
  },
  {
    id: 2,
    title: "Phân tích thị trường tài chính tuần này",
    description: "Cập nhật và phân tích tình hình thị trường tài chính trong tuần qua...",
    thumbnail: "/api/placeholder/400/225",
    duration: "15:45",
    views: 3800,
    publishDate: "2024-03-13",
    category: "Phân tích",
    author: "Chuyên gia A"
  },
  {
    id: 3,
    title: "Tips đầu tư cho người mới bắt đầu",
    description: "Những lời khuyên hữu ích dành cho những người mới bắt đầu đầu tư...",
    thumbnail: "/api/placeholder/400/225",
    duration: "12:20",
    views: 7100,
    publishDate: "2024-03-11",
    category: "Đầu tư",
    author: "Chuyên gia B"
  },
  {
    id: 4,
    title: "Cách quản lý rủi ro trong đầu tư",
    description: "Hướng dẫn các phương pháp quản lý rủi ro hiệu quả khi đầu tư...",
    thumbnail: "/api/placeholder/400/225",
    duration: "18:15",
    views: 2900,
    publishDate: "2024-03-09",
    category: "Quản lý",
    author: "Chuyên gia C"
  },
  {
    id: 5,
    title: "Xu hướng cryptocurrency 2024",
    description: "Phân tích xu hướng và dự báo thị trường cryptocurrency trong năm 2024...",
    thumbnail: "/api/placeholder/400/225",
    duration: "22:30",
    views: 4500,
    publishDate: "2024-03-07",
    category: "Crypto",
    author: "Chuyên gia D"
  },
  {
    id: 6,
    title: "Lập kế hoạch tài chính cá nhân",
    description: "Hướng dẫn chi tiết cách lập kế hoạch tài chính cá nhân hiệu quả...",
    thumbnail: "/api/placeholder/400/225",
    duration: "14:50",
    views: 3200,
    publishDate: "2024-03-05",
    category: "Kế hoạch",
    author: "Chuyên gia E"
  }
];

const categories = ['Tất cả', 'Hướng dẫn', 'Phân tích', 'Đầu tư', 'Quản lý', 'Crypto', 'Kế hoạch'];

export default function VideosPage() {
  const [videos] = useState<Video[]>(mockVideos);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(mockVideos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterVideos(term, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterVideos(searchTerm, category);
  };

  const filterVideos = (search: string, category: string) => {
    let filtered = videos;

    if (search) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'Tất cả') {
      filtered = filtered.filter(video => video.category === category);
    }

    setFilteredVideos(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Video hướng dẫn</h1>
              <p className="text-sm text-gray-500">Học hỏi từ các video chuyên môn</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm video..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Filter className="h-4 w-4 mr-1" />
                Bộ lọc {showFilters ? '▲' : '▼'}
              </button>

              {/* Category Filter */}
              {showFilters && (
                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Hiển thị {filteredVideos.length} / {videos.length} video
          </div>

          {/* Videos Grid */}
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white bg-red-600 rounded-full p-3" />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    VIDEO
                  </span>
                </div>

                {/* Video Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      {video.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(video.publishDate)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatViews(video.views)} lượt xem
                      </span>
                      <span>{video.duration}</span>
                    </div>
                    <span>Bởi {video.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy video</h3>
              <p className="text-sm text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
