import React, { useEffect, useState } from 'react';
import { postService } from '../../services/postService';
import { Post, CreatePostRequest, CreateImagePostRequest, CreateVideoPostRequest, UpdatePostRequest, PostType } from '../../types/Post';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Plus, Image as ImageIcon, Video as VideoIcon, Type, Edit, Trash2 } from 'lucide-react';

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<PostType>('TEXT');
  const [editing, setEditing] = useState<Post | null>(null);

  const [caption, setCaption] = useState('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const page1 = await postService.getPeginated(1, 10);
      setPosts(page1.data || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = (m: PostType) => {
    setEditing(null);
    setMode(m);
    setCaption('');
    setIsPublic(false);
    setFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: Post) => {
    setEditing(p);
    setMode(p.type || 'TEXT');
    setCaption(p.caption || '');
    setIsPublic(Boolean(p.isPublic));
    setFile(null);
    setIsModalOpen(true);
  };

  const create = async () => {
    try {
      if (mode === 'TEXT') {
        const payload: CreatePostRequest = { caption, isPublic };
        await postService.createTextPost(payload);
      } else if (mode === 'IMAGE') {
        if (!file) { setError('Please select an image'); return; }
        const payload: CreateImagePostRequest = { caption, file, isPublic };
        await postService.createImagePost(payload);
      } else if (mode === 'VIDEO') {
        if (!file) { setError('Please select a video'); return; }
        const payload: CreateVideoPostRequest = { caption, file, isPublic };
        await postService.createVideoPost(payload);
      }
      setIsModalOpen(false);
      await load();
    } catch (e) {
      console.error(e);
      setError('Failed to create post');
    }
  };

  const update = async () => {
    if (!editing) return;
    try {
      const payload: UpdatePostRequest = { caption };
      await postService.updatePost(editing.id, payload);
      setIsModalOpen(false);
      await load();
    } catch (e) {
      console.error(e);
      setError('Failed to update post');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await postService.deletePost(id);
      await load();
    } catch (e) {
      console.error(e);
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600 mt-2">Create, edit and manage posts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Type} onClick={() => openCreate('TEXT')}>Text</Button>
          <Button variant="outline" icon={ImageIcon} onClick={() => openCreate('IMAGE')}>Image</Button>
          <Button variant="outline" icon={VideoIcon} onClick={() => openCreate('VIDEO')}>Video</Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caption</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.caption}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.type ? p.type : 'TEXT'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {p.isPublic ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="outline" size="sm" icon={Edit} onClick={() => openEdit(p)}>Edit</Button>
                  <Button variant="outline" size="sm" icon={Trash2} className="text-red-600" onClick={() => remove(p.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Post' : `New ${mode.charAt(0).toUpperCase() + mode.slice(1)} Post`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Caption</label>
              <textarea className="mt-1 w-full px-3 py-2 border rounded-md" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            {!editing && (
              <div>
                <label className="inline-flex items-center text-sm font-medium text-gray-700">
                  <input type="checkbox" className="mr-2" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                  Public
                </label>
              </div>
            )}
              {!editing && (mode === 'IMAGE' || mode === 'VIDEO') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">{mode === 'IMAGE' ? 'Image' : 'Video'} File</label>
                <input type="file" accept={mode === 'IMAGE' ? 'image/*' : 'video/*'} className="mt-1 w-full" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            )}
            <div className="pt-2 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              {editing ? (
                <Button variant="primary" onClick={update}>Update</Button>
              ) : (
                <Button variant="primary" onClick={create}>Create</Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PostsPage;
