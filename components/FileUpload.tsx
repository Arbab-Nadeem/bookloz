/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from 'imagekitio-next';
import Image from 'next/image';

import config from '@/lib/config';
import { cn } from '@/lib/utils';

const {
	env: {
		imagekit: { publicKey, urlEndpoint },
	},
} = config;

interface Props {
	type: 'image' | 'video';
	value?: string;
	accept: string;
	placeholder: string;
	folder: string;
	variant: 'dark' | 'light';
	onFileChange: (filePath: string) => void;
}

const FileUpload = ({
	type,
	value,
	accept,
	placeholder,
	folder,
	variant,
	onFileChange,
}: Props) => {
	const { toast } = useToast();

	const [progress, setProgress] = useState(0);
	const [file, setFile] = useState<{ filePath: string | null }>({
		filePath: value ?? null,
	});
	const ikUploadRef = useRef(null);

	const styles = {
		button:
			variant === 'dark'
				? 'bg-dark-300'
				: 'bg-light-600 border-gray-100 border',
		placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
		text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
	};

	const authenticator = async () => {
		try {
			const response = await fetch(
				`${config.env.apiEndpoint}/api/auth/imagekit`
			);
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Request failed with status ${response.status}: ${errorText}`
				);
			}

			// Use the response as-is since it matches the expected format
			const { token, expire, signature } = await response.json();
			return { token, expire, signature };
		} catch (error: any) {
			throw new Error(`Authentication failed: ${error.message}`);
		}
	};

	const onError = (err: any) => {
		console.log(err);
		toast({
			title: `${type} upload failed`,
			description: `Your ${type} could not be uploaded. Please try again.`,
			variant: 'destructive',
		});
	};
	const onSucess = (res: any) => {
		setFile(res);
		onFileChange(res.filePath);
		toast({
			variant: 'success',
			title: `${type} uploaded successfully`,
			description: `${res.filePath} uploaded successfully!`,
		});
	};

	const onValidate = (file: File) => {
		if (type === 'image') {
			if (file.size > 20 * 1024 * 1024) {
				toast({
					title: 'File is too large',
					description: 'Please upload a file that is less than 20 MB',
					variant: 'destructive',
				});
				return false;
			}
		} else if (type === 'video') {
			if (file.size > 50 * 1024 * 1024) {
				toast({
					title: 'File is too large',
					description: 'Please upload a file that is less than 50 MB',
					variant: 'destructive',
				});
				return false;
			}
		}

		return true;
	};
	return (
		<ImageKitProvider
			publicKey={publicKey}
			urlEndpoint={urlEndpoint}
			authenticator={authenticator}
		>
			<IKUpload
				className='hidden'
				ref={ikUploadRef}
				onError={onError}
				onSuccess={onSucess}
				useUniqueFileName={true}
				validateFile={onValidate}
				onUploadStart={() => setProgress(0)}
				onUploadProgress={({ loaded, total }) => {
					const progress = Math.round((loaded / total) * 100);
					setProgress(progress);
				}}
				folder={folder}
				accept={accept}
			/>
			<button
				className={cn('upload-btn', styles.button)}
				onClick={(e) => {
					e.preventDefault();
					if (ikUploadRef.current) {
						// @ts-ignore
						ikUploadRef.current?.click();
					}
				}}
			>
				<Image
					src='/icons/upload.svg'
					alt='Upload image'
					width={20}
					height={20}
					className='object-contain'
				/>

				<p className={cn('text-base', styles.placeholder)}>{placeholder}</p>
				{file && (
					<p className={cn('upload-filename', styles.text)}>{file.filePath}</p>
				)}
			</button>

			{progress > 0 && progress !== 100 && (
				<div className='w-full rounded-full bg-gray-200'>
					<div className='progress' style={{ width: `${progress}%` }}>
						{progress}%
					</div>
				</div>
			)}
			{file &&
				(type === 'image' ? (
					<IKImage
						path={file.filePath}
						alt={file.filePath}
						width={500}
						height={300}
						className='object-contain bg-cover w-full h-full'
					/>
				) : type === 'video' ? (
					<IKVideo
						path={file.filePath}
						controls={true}
						className='h-96 w-full rounded-xl'
					/>
				) : null)}
		</ImageKitProvider>
	);
};

export default FileUpload;
