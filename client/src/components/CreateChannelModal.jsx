import  { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useChatContext } from 'stream-chat-react';
import {toast} from 'react-hot-toast';
import * as Sentry from "@sentry/react";
import '../styles/stream-chat-theme.css';
import { AlertCircle, HashIcon, LockIcon, UsersIcon, XIcon } from 'lucide-react';

const CreateChannelModal = ({ onClose }) => {
    const [channelName, setChannelName] = useState('');
    const [channelType, setChannelType] = useState('public');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [_, setSearchParams] = useSearchParams();

    const {client, setActiveChannel} = useChatContext();

    useEffect(()=>{
        const fetchUsers = async () => {
            if(!client?.user) return;
            setLoadingUsers(true);
            try{
                const response = await client.queryUsers(
                    {id: { $ne: client.user.id }},
                    {name: 1},
                    {limit: 100}
                )
                setUsers(response.users || []);
            }catch(error){
                console.error('Error fetching users:', error);
                Sentry.captureException(error, {
                    tags: { component: "CreateChannelModal" },
                    extra: {
                        context: "fetch_users_for_channel"
                    },
                })
                setUsers([]);
            }finally{
                setLoadingUsers(false);
            }
        }
    },[client]);

    // useEffect(()=>{
    //     setChannelName('');
    //     setChannelType('public');
    //     setDescription('');
    //     setSelectedMembers([]);
    //     setError(null);
    // }, []);

    useEffect(()=>{
        if(channelType === 'publick')setSelectedMembers(users.map((user) => user.id));
        else setSelectedMembers([]);
    },[channelType, users]);
    const validateChannelName = (name) => {
        if(!name.trim())return 'Channel name is required';
        if(name.length < 3) return 'Channel name must be at least 3 characters long';
        if(name.length > 22) return 'Channel name must be less than 22 characters long';
        return '';
    }

    const handleChannelNameChange=(e)=>{
        const name = e.target.value;
        setChannelName(name);
        setError(validateChannelName(name));
    }

    const handleMemberToggle=(id)=>{
        if(selectedMembers.includes(id)){
            setSelectedMembers(selectedMembers.filter((member) => member !== id));
        }else{
            setSelectedMembers([...selectedMembers, id]);
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const validationError = validateChannelName(channelName);
        if(validationError) return setError(validationError);
        if(isCreating || !client?.user) return;

        setIsCreating(true);
        setError('');
        try {
            const channelId = channelName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-_]/g, '')
            .slice(0, 20);

            const channelData = {
                name: channelName.trim(),
                created_by_id: client.user.id,
                members:[
                    client.user.id,
                    ...selectedMembers
                ]
            }
            if(description) channelData.description = description;

            if(channelType === 'private'){
                channelData.private = true
                channelData.visibility = 'private';
            }else{
                channelData.visibility = 'public';
                channelData.discoverable = true;
            }

            const channel = client.channel('messaging', channelId, channelData);
            await channel.watch();
            setActiveChannel(channel);
            setSearchParams({channel: channel?.id});
            toast.success(`Channel "${channel?.name}" created successfully`);
            onClose();
        } catch (error) {
            console.log('Error creating channel:', error);
        }finally{
            setIsCreating(false);
        }
    }
  return (
    <div className='create-channel-modal-overlay'>
    <div className='create-channel-modal'>
        <div className='create-channel-modal__header'>
            <h2 className=''>
                Create Channel
            </h2>
            <button onClick={onClose} className='create-channel-modal__close'>
            <XIcon className='size-5'/>
            </button>
        </div>
        <form onSubmit={handleSubmit} className='create-channel-modal__form'>
            {error && (
                <div className='form-error'>
                    <AlertCircle className='size-4'/>
                    <span>{error}</span>
                </div>
            )}
            <div className='form-group'>
                <div className='input-with-icon'>
                <HashIcon className='size-4 input-icon'/>
                    <input
                        id="channelName"
                        type="text"
                        placeholder="Channel name"
                        value={channelName}
                        onChange={handleChannelNameChange}
                        autoFocus
                        className={`form-input ${error ? 'form-input--error' : ''}`}
                        maxLength={22}
                    />
                </div>

                {channelName && (
                    <div className='form-hint'>
                        Channel ID will be: #
                        {channelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')}
                    </div>
                )}
            </div>

            <div className='form-group'>
                <label>Channel Type</label>
                <div className='radio-group'>
                    <label className='radio-option'>
                        <input
                            type="radio"
                            value="public"
                            checked={channelType === 'public'}
                            onChange={(e) => setChannelType(e.target.value)}
                        />
                        <div className='radio-content'>
                            <HashIcon className='size-4'/>
                            <div>
                                <div className='radio-title'>Public</div>
                                <div className='radio-description'>Anyone can join this channel</div>
                            </div>
                        </div>
                    </label>

                    <label className='radio-option'>
                        <input
                            type="radio"
                            value="private"
                            checked={channelType === 'private'}
                            onChange={(e) => setChannelType(e.target.value)}
                        />
                        <div className='radio-content'>
                            <LockIcon className='size-4'/>
                            <div>
                                <div className='radio-title'>Private</div>
                                <div className='radio-description'>Only invited users can join this channel</div>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {channelType === 'private' && (
                <div className='form-group'>
                    <label>Add Members</label>
                    <div className='member-selection-header'>
                        <button
                        type='button'
                        className='btn btn-secondary btn-small'
                        onClick={()=>setSelectedMembers(users.map(u=>u.id))}
                        disabled={loadingUsers || users.length === 0}
                        >
                            <UsersIcon className='size-4'/>
                            Select Everyone
                        </button>
                        <span className='selected-count'>
                            {selectedMembers.length} selected
                        </span>
                    </div>

                    <div className='members-list'>
                        {loadingUsers ? (
                            <p>Loading users...</p>
                        ) : users.length === 0 ? (
                            <p>No users found</p>
                        ):(
                           users.map(user=>(
                            <label
                            key={user.id}
                            className='member-item'
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(user.id)}
                                    onChange={() => handleMemberToggle(user.id)}
                                    className='member-checkbox'
                                />
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || user.id}
                                        className='member-avatar'
                                    />
                                ): (
                                    <div className='member-avatar member-avatar-placeholder'>
                                        <span>{(user.name || user.id).charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                                <span className='member-name'>{user.name || user.id}</span>
                            </label>
                           ))
                        )}
                    </div>
                </div>
            )}

            <div className='form-group'>
                <label htmlFor='description'>Description (optional)</label>
                <textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this channel about?"
                    className={'form-textarea'}
                    rows={3}
                />
            </div>

            <div className='create-channel-modal__actions'>
                <button
                type='button'
                onClick={onClose}
                className='btn btn-secondary'
                >
                    Cancel
                </button>
                <button
                type='submit'
                className='btn btn-primary'
                disabled={!channelName.trim() || isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create Channel'}
                </button>
            </div>
        </form>
    </div>
    </div>
  )
}

export default CreateChannelModal