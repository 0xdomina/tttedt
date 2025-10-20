import React, { useState, useRef, useMemo, useEffect } from 'react';
import { SpinnerIcon, ImageIcon, TrashIcon, VideoIcon, MapPinIcon, CheckCircleIcon, CameraIcon, PlayIcon } from '../Icons';
import { User, NewPropertyData } from '../../types';

interface MediaPreview {
  id: string;
  url: string;
}

interface PostFormProps {
    onSubmit: (data: NewPropertyData) => Promise<void>;
    currentUser: User;
    initialData?: Partial<NewPropertyData> | null;
    onAddStory: (file: File) => void;
    onCancel: () => void;
    onPostSuccess: () => void;
}

const NumberStepper: React.FC<{ label: string; value: number; onChange: (value: number) => void; min?: number; }> = ({ label, value, onChange, min = 0 }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="px-2 py-0.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">-</button>
    <span className="w-5 text-center font-semibold">{value}</span>
    <button type="button" onClick={() => onChange(value + 1)} className="px-2 py-0.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">+</button>
  </div>
);


const PostForm: React.FC<PostFormProps> = ({ onSubmit, initialData, currentUser, onAddStory, onCancel, onPostSuccess }) => {
  const [postType, setPostType] = useState<'property' | 'normal'>('property');
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<MediaPreview[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<MediaPreview[]>([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [coordsCaptured, setCoordsCaptured] = useState(false);
  const [price, setPrice] = useState('');
  const [priceInterval, setPriceInterval] = useState<'year' | 'month' | 'week' | 'day' | 'night'>('year');
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setLocation(initialData.location || '');
      setPrice(initialData.price?.toString() || '');
      setBeds(initialData.beds || 1);
      setBaths(initialData.baths || 1);
      setListingType(initialData.type || 'rent');
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      videoPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews, videoPreviews]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event.target.files || []);
    const newImages = files.map(file => ({ file, preview: { id: `${file.name}-${Date.now()}`, url: URL.createObjectURL(file) } }));
    setImages(prev => [...prev, ...newImages.map(i => i.file)]);
    setImagePreviews(prev => [...prev, ...newImages.map(i => i.preview)]);
    if(event.target) event.target.value = '';
  };
  
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event.target.files || []);
    const newVideos = files.map(file => ({ file, preview: { id: `${file.name}-${Date.now()}`, url: URL.createObjectURL(file) } }));
    setVideos(prev => [...prev, ...newVideos.map(i => i.file)]);
    setVideoPreviews(prev => [...prev, ...newVideos.map(i => i.preview)]);
    if(event.target) event.target.value = '';
  };

  const handleStoryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        onAddStory(file);
    }
    if (event.target) event.target.value = ''; // Reset file input
  };
  
  const removeImage = (id: string) => {
    const toRemoveIndex = imagePreviews.findIndex(p => p.id === id);
    if (toRemoveIndex === -1) return;
    URL.revokeObjectURL(imagePreviews[toRemoveIndex].url);
    setImagePreviews(prev => prev.filter(img => img.id !== id));
    setImages(prev => prev.filter((_, index) => index !== toRemoveIndex));
  };

  const removeVideo = (id: string) => {
    const toRemoveIndex = videoPreviews.findIndex(p => p.id === id);
    if (toRemoveIndex === -1) return;
    URL.revokeObjectURL(videoPreviews[toRemoveIndex].url);
    setVideoPreviews(prev => prev.filter(vid => vid.id !== id));
    setVideos(prev => prev.filter((_, index) => index !== toRemoveIndex));
  };

  const handleUseCurrentLocation = () => {
    setIsFetchingLocation(true);
    setCoordsCaptured(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        
        setTimeout(() => {
            const addresses = ["Adetokunbo Ademola Street, Victoria Island", "Bode Thomas Street, Surulere", "Allen Avenue, Ikeja", "Admiralty Way, Lekki Phase 1", "Ozumba Mbadiwe Avenue, Victoria Island", "Herbert Macaulay Way, Yaba"];
            const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
            setLocation(randomAddress);
            setIsFetchingLocation(false);
            setCoordsCaptured(true);
        }, 1200);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location. Please check your browser settings and try again.");
        setIsFetchingLocation(false);
      }
    );
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    if (coordsCaptured) {
        setCoordsCaptured(false);
    }
  }
  
  const isFormValid = useMemo(() => {
    if (postType === 'normal') {
        return description.trim().length > 0 || images.length > 0 || videos.length > 0;
    }
    return description.trim() !== '' && 
           location.trim() !== '' && 
           price.trim() !== '' && 
           parseFloat(price) > 0 &&
           baths >= 1;
  }, [postType, description, location, price, baths, images.length, videos.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
        const data: NewPropertyData = {
            images, videos, description, postType,
            ...(postType === 'property' && { location, price: parseFloat(price), beds, baths, type: listingType, priceInterval, latitude, longitude })
        };
        await onSubmit(data);
        setImages([]); setImagePreviews([]); setVideos([]); setVideoPreviews([]); setDescription(''); setLocation(''); setPrice(''); setBeds(1); setBaths(1); setListingType('rent'); setPostType('property'); setLatitude(undefined); setLongitude(undefined); setCoordsCaptured(false);
        onPostSuccess();
    } finally { setIsSubmitting(false); }
  };
  
  const characterLimit = 300;
  const descriptionLength = description.length;
  const charColor = descriptionLength >= characterLimit ? 'text-red-500' : descriptionLength > characterLimit - 20 ? 'text-yellow-500' : 'text-gray-400';

  const mediaPreviews = [...imagePreviews.map(p => ({...p, type: 'image'})), ...videoPreviews.map(p => ({...p, type: 'video'}))];

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 mb-2">
        <button type="button" onClick={() => setPostType('property')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${postType === 'property' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Property Post</button>
        <button type="button" onClick={() => setPostType('normal')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${postType === 'normal' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Normal Post</button>
      </div>
      <div className="border border-gray-200 rounded-lg p-2 flex flex-col sm:flex-row gap-0 sm:gap-2">
          <div className={`w-full ${postType === 'property' ? 'sm:flex-1' : ''} relative`}>
               <textarea autoFocus id="description" rows={3} maxLength={characterLimit} value={description} onChange={e => setDescription(e.target.value)} className="w-full h-full p-2 bg-transparent border-none rounded-md resize-none focus:outline-none placeholder-gray-500" placeholder={postType === 'property' ? "What makes this property special? Describe it here..." : "What's on your mind?"} />
              <span className={`absolute bottom-2 right-2 text-xs transition-colors ${charColor}`}>{descriptionLength}/{characterLimit}</span>
          </div>
          {postType === 'property' && (
          <div className="w-full sm:w-1/3 flex flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-2">
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 bg-gray-100/50 border-none rounded-md focus:outline-none" placeholder="Price (₦)" />
              <div className="relative">
                <input type="text" value={location} onChange={handleLocationChange} className="w-full p-2 pr-10 bg-gray-100/50 border-none rounded-md focus:outline-none" placeholder="Location" />
                <button type="button" onClick={handleUseCurrentLocation} disabled={isFetchingLocation} className="absolute top-1/2 right-2 -translate-y-1/2 text-violet-600 hover:text-violet-800 disabled:text-gray-400 p-1">
                  {isFetchingLocation ? <SpinnerIcon className="w-5 h-5" /> : <MapPinIcon className="w-5 h-5" />}
                </button>
              </div>
          </div>
          )}
      </div>
      {postType === 'property' && coordsCaptured && (
        <div className="mt-2 text-xs text-green-700 bg-green-100 font-medium flex items-center gap-1.5 px-2 py-1 rounded-md">
            <CheckCircleIcon className="w-4 h-4" />
            Coordinates captured for accurate map pinning.
        </div>
      )}
      {mediaPreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {mediaPreviews.map(media => (
            <div key={media.id} className="relative group aspect-square">
              {media.type === 'image' ? (
                <img src={media.url} alt="preview" className="h-full w-full object-cover rounded-md" />
              ) : (
                <>
                    <video src={media.url} className="h-full w-full object-cover rounded-md bg-black" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"><PlayIcon className="w-8 h-8 text-white/80" /></div>
                </>
              )}
              <button type="button" onClick={() => media.type === 'image' ? removeImage(media.id) : removeVideo(media.id)} className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"><TrashIcon className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap justify-between items-center mt-3 gap-y-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <button type="button" onClick={() => imageInputRef.current?.click()} className="text-violet-600 p-2 rounded-full hover:bg-violet-100" title="Add image to post"> <ImageIcon className="w-6 h-6" /> </button>
            <input ref={imageInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button type="button" onClick={() => videoInputRef.current?.click()} className="text-violet-600 p-2 rounded-full hover:bg-violet-100" title="Add video to post"> <VideoIcon className="w-6 h-6" /> </button>
            <input ref={videoInputRef} type="file" multiple accept="video/*" className="hidden" onChange={handleVideoUpload} />
            <div className="h-6 border-l border-gray-200 mx-1 sm:mx-2"></div>
            <button type="button" onClick={() => storyInputRef.current?.click()} className="flex items-center gap-2 text-violet-600 p-2 rounded-full hover:bg-violet-100" title="Add to your story"><CameraIcon className="w-6 h-6" /><span className="text-sm font-semibold hidden sm:inline">Add Story</span></button>
            <input ref={storyInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleStoryUpload} />
            {postType === 'property' && (
            <>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setListingType('rent')} className={`px-2 py-1 text-xs font-semibold rounded-l-md transition-colors ${listingType === 'rent' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Rent</button>
                    <button type="button" onClick={() => setListingType('sale')} className={`px-2 py-1 text-xs font-semibold rounded-r-md transition-colors ${listingType === 'sale' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Sale</button>
                </div>
                {listingType === 'rent' && currentUser.accountType === 'business' && currentUser.businessStatus === 'verified' && (
                    <select value={priceInterval} onChange={e => setPriceInterval(e.target.value as any)} className="text-xs font-semibold bg-gray-200 text-gray-700 rounded-md p-1 border-none focus:ring-1 focus:ring-violet-500">
                        <option value="year">/year</option><option value="month">/month</option><option value="week">/week</option><option value="day">/day</option><option value="night">/night</option>
                    </select>
                )}
                <NumberStepper label="Beds" value={beds} onChange={setBeds} min={0} />
                <NumberStepper label="Baths" value={baths} onChange={setBaths} min={1} />
            </>
            )}
        </div>
        <div className="flex items-center gap-2">
            <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" disabled={!isFormValid || isSubmitting} className="px-6 py-2 bg-violet-500 text-white rounded-full font-semibold hover:bg-violet-600 disabled:bg-violet-300 flex items-center justify-center min-w-[80px]">{isSubmitting ? <SpinnerIcon className="w-5 h-5" /> : 'Post'}</button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;