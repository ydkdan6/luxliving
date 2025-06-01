import React from 'react';
import { 
  PenSquare, 
  Home, 
  MessageSquare, 
  Plus, 
  Mail, 
  Search, 
  Filter,
  Archive,
  Trash2,
  Reply,
  MoreVertical,
  Clock,
  User,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import type { BlogPost, Property, ContactForm, ContactMessage } from '../../types';
import { supabase } from '../../lib/supabase';

function Admin() {
  const [activeTab, setActiveTab] = React.useState('blog');
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [contacts, setContacts] = React.useState<ContactForm[]>([]);
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = React.useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [messageFilter, setMessageFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessages, setSelectedMessages] = React.useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const [postsData, propertiesData, contactsData, messagesData] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_forms').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ]);

      if (postsData.error) throw postsData.error;
      if (propertiesData.error) throw propertiesData.error;
      if (contactsData.error) throw contactsData.error;
      if (messagesData.error) throw messagesData.error;

      setPosts(postsData.data || []);
      setProperties(propertiesData.data || []);
      setContacts(contactsData.data || []);
      setMessages(messagesData.data || []);
      setFilteredMessages(messagesData.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const refreshMessages = async () => {
    setRefreshing(true);
    try {
      const messagesData = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesData.error) throw messagesData.error;

      setMessages(messagesData.data || []);
      setFilteredMessages(messagesData.data || []);
      
      // Show a brief success indication
      setTimeout(() => setRefreshing(false), 500);
    } catch (error) {
      console.error('Error refreshing messages:', error);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    async function initialLoad() {
      setLoading(true);
      await fetchData();
      setLoading(false);
    }
    initialLoad();
  }, []);

  // Filter messages based on search and filter criteria
  React.useEffect(() => {
    let filtered = messages;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply read/unread filter
    if (messageFilter === 'read') {
      filtered = filtered.filter(msg => msg.read);
    } else if (messageFilter === 'unread') {
      filtered = filtered.filter(msg => !msg.read);
    }

    setFilteredMessages(filtered);
  }, [messages, searchQuery, messageFilter]);

  const handleDelete = async (type: string, id: string) => {
    try {
      const { error } = await supabase
        .from(type === 'blog' ? 'blog_posts' : 'properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (type === 'blog') {
        setPosts(posts.filter(post => post.id !== id));
      } else {
        setProperties(properties.filter(property => property.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const toggleMessageSelection = (id: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMessages(newSelected);
  };

  const handleBulkAction = async (action: 'read' | 'unread' | 'delete') => {
    const messageIds = Array.from(selectedMessages);
    
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .in('id', messageIds);
        
        if (error) throw error;
        setMessages(messages.filter(msg => !selectedMessages.has(msg.id)));
      } else {
        const { error } = await supabase
          .from('contact_messages')
          .update({ read: action === 'read' })
          .in('id', messageIds);
        
        if (error) throw error;
        setMessages(messages.map(msg => 
          selectedMessages.has(msg.id) ? { ...msg, read: action === 'read' } : msg
        ));
      }
      
      setSelectedMessages(new Set());
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px text-black">
              <button
                onClick={() => setActiveTab('blog')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'blog'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <PenSquare className="inline-block mr-2" size={18} />
                Blog Posts
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Home className="inline-block mr-2" size={18} />
                Properties
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="inline-block mr-2" size={18} />
                Contact Forms
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className="inline-block mr-2" size={18} />
                Messages
                {messages.filter(msg => !msg.read).length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-primary-500 text-white rounded-full">
                    {messages.filter(msg => !msg.read).length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab !== 'contacts' && activeTab !== 'messages' && (
              <button className="btn-secondary mb-6">
                <Plus className="inline-block mr-2" size={18} />
                Add New {activeTab === 'blog' ? 'Post' : 'Property'}
              </button>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-secondary border border-secondary rounded hover:bg-secondary hover:text-white transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('blog', post.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'properties' && (
              <div className="space-y-4">
                {properties.map(property => (
                  <div key={property.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{property.title}</h3>
                        <p className="text-sm text-gray-500">
                          ${property.price.toLocaleString()} - {property.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-secondary border border-secondary rounded hover:bg-secondary hover:text-white transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('property', property.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {contacts.map(contact => (
                  <div key={contact.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span> {contact.email}
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span> {contact.phone}
                      </div>
                      <div>
                        <span className="text-gray-500">Property Type:</span> {contact.property_type}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{contact.about}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="flex h-[600px] bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Messages Sidebar */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                  {/* Search and Filter Header */}
                  <div className="p-4 border-b border-gray-200 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search messages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                      <button
                        onClick={refreshMessages}
                        disabled={refreshing}
                        className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                          refreshing ? 'animate-spin' : ''
                        }`}
                        title="Refresh messages"
                      >
                        <RefreshCw size={16} className="text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <select
                        value={messageFilter}
                        onChange={(e) => setMessageFilter(e.target.value as 'all' | 'unread' | 'read')}
                        className="text-sm border text-black border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="all" className='text-black'>All Messages</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                      </select>
                      
                      {selectedMessages.size > 0 && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleBulkAction('read')}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          >
                            Mark Read
                          </button>
                          <button
                            onClick={() => handleBulkAction('delete')}
                            className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredMessages.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Mail size={48} className="mx-auto mb-2 text-gray-300" />
                        <p>No messages found</p>
                      </div>
                    ) : (
                      filteredMessages.map(message => (
                        <div
                          key={message.id}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (!message.read) {
                              markMessageAsRead(message.id);
                            }
                          }}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                          } ${!message.read ? 'bg-blue-25' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedMessages.has(message.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleMessageSelection(message.id);
                                }}
                                className="rounded text-secondary focus:ring-secondary"
                              />
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${!message.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                <User size={16} className="text-gray-400" />
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                          </div>
                          
                          <h4 className={`font-medium text-sm ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">{message.email}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Message Detail Panel */}
                <div className="flex-1 flex flex-col">
                  {selectedMessage ? (
                    <>
                      {/* Message Header */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="font-semibold text-lg">{selectedMessage.name}</h2>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-200 rounded" title="Reply">
                              <Reply size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded" title="Archive">
                              <Archive size={16} className="text-gray-600" />
                            </button>
                            <button 
                              onClick={() => deleteMessage(selectedMessage.id)}
                              className="p-1 hover:bg-gray-200 rounded" 
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{selectedMessage.email}</span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {new Date(selectedMessage.created_at).toLocaleString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedMessage.read ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {selectedMessage.read ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-1 p-6 overflow-y-auto">
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>
                      
                      {/* Reply Section */}
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <button className="btn-secondary">
                          <Reply className="inline-block mr-2" size={16} />
                          Reply to {selectedMessage.name}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Select a message to view</p>
                        <p className="text-sm">Choose a message from the sidebar to read its content</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;