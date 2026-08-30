/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * One place that decides whether a URL from the CMS is a video or an image,
 * so editors can paste either into any media field.
 */

import React from 'react';

const VIDEO_EXT = ['.mp4', '.webm', '.mov', '.m4v'];

export const isVideoUrl = (src?: string) => {
  if (!src) return false;
  const clean = src.split('?')[0].trim().toLowerCase();
  return VIDEO_EXT.some((ext) => clean.endsWith(ext));
};

interface MediaProps {
  src?: string;
  alt?: string;
  className?: string;
  /** Rendered when src is empty — keeps layout height stable. */
  placeholderClassName?: string;
}

const Media: React.FC<MediaProps> = ({ src, alt = '', className = '', placeholderClassName }) => {
  if (!src) return <div className={`${className} ${placeholderClassName ?? 'bg-slate-200'}`} />;

  if (isVideoUrl(src)) {
    return <video src={src} className={className} autoPlay loop muted playsInline />;
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
};

export default Media;
