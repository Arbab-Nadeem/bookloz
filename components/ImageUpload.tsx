/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import Image from 'next/image';

import config from '@/lib/config';

const {
	env: {
		imagekit: { publicKey, urlEndpoint },
	},
} = config;

const ImageUpload = ({
	onFileChange,
}: {
	onFileChange: (filePath: string) => void;
}) => {
	const { toast } = useToast();
	const [file, setFile] = useState<{ filePath: string } | null>(null);
	const ikUploadRef = useRef(null);

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
			variant: 'destructive',
			title: 'Image upload failed',
			description: 'Your image could not be uploaded. Please try again.',
		});
	};
	const onSucess = (res: any) => {
		setFile(res);
		onFileChange(res.filePath);
		toast({
			variant: 'success',
			title: 'Image uploaded successfully',
			description: `${res.filePath} uploaded successfully!`,
		});
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
				fileName='test-filename.png'
			/>
			<button
				className='upload-btn'
				onClick={(e) => {
					e.preventDefault();
					if (ikUploadRef.current) {
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

				<p className='text-base text-light-100'>Upload a file</p>
				{file && <p className='text-base text-'>{file.filePath}</p>}
			</button>
			{file && (
				<IKImage
					path={file.filePath}
					alt={file.filePath}
					width={500}
					height={300}
				/>
			)}
		</ImageKitProvider>
	);
};

export default ImageUpload;
