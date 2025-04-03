# Accelr8 Sanity CMS Integration Guide for Frontend Developers

## Overview

This guide provides comprehensive information on integrating the Accelr8 Sanity CMS with your Next.js frontend application. It covers setup, content querying, handling relationships, working with images, and best practices.

## Project Configuration

### Sanity Project Details

```
Project ID: 129r9wdk
Dataset: production
API Version: v2023-06-01 (recommended)
```

### Key Content Types

Our Sanity CMS includes the following primary content types:

- **House** - Hacker house properties and their details
- **Person** - Team members and residents
- **Event** - Hackathons, workshops, and social gatherings
- **BlogPost** - Blog content with rich text and code blocks
- **Amenity** - House features and facilities
- **Testimonial** - User feedback and quotes
- **FAQ** - Frequently asked questions
- **Resource** - Bookable spaces and equipment
- **MainPage** - Page builder for website sections

## Setting Up Sanity Client in Next.js

### Installation

```bash
npm install next-sanity @portabletext/react @sanity/image-url
```

### Client Configuration

Create a `lib/sanity.js` file:

```javascript
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '129r9wdk',
  dataset: 'production',
  apiVersion: '2023-06-01', // Use the latest stable API version
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production
})

// Set up image URL builder
const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
```

### Environment Variables Setup

In your `.env.local` file:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=129r9wdk
NEXT_PUBLIC_SANITY_DATASET=production
```

## Querying Content with GROQ

GROQ (Graph-Relational Object Queries) is Sanity's query language. Here are examples for querying different content types:

### Fetching Houses

```javascript
// Get all houses
const houses = await client.fetch(`
  *[_type == "house"] {
    _id,
    name,
    slug,
    location,
    description,
    mainImage,
    amenities[]->{ // References to amenity documents
      _id,
      name,
      icon
    }
  }
`)

// Get a specific house by slug
const house = await client.fetch(`
  *[_type == "house" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    location,
    description,
    mainImage,
    amenities[]->
  }
`, { slug: "san-francisco-house" })
```

### Fetching Blog Posts

```javascript
// Get all blog posts
const posts = await client.fetch(`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->{name, image, bio},
    "categories": categories[]->{ title }
  }
`)

// Get a specific blog post with full body content
const post = await client.fetch(`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    body,
    "author": author->{name, image, bio},
    "categories": categories[]->{ title },
    "relatedPosts": relatedPosts[]->{ title, slug, mainImage }
  }
`, { slug: "post-slug" })
```

### Fetching Events

```javascript
// Get upcoming events
const upcomingEvents = await client.fetch(`
  *[_type == "event" && dateTime > now()] | order(dateTime asc) {
    _id,
    title,
    description,
    dateTime,
    location,
    image,
    "house": house->name
  }
`)
```

### Fetching Main Pages

```javascript
// Get a specific page by slug
const page = await client.fetch(`
  *[_type == "mainPage" && slug.current == $slug][0] {
    _id,
    title,
    content[] {
      _type == 'hero' => {
        _type,
        heading,
        subheading,
        image
      },
      _type == 'textSection' => {
        _type,
        heading,
        text
      },
      _type == 'imageTextSection' => {
        _type,
        heading,
        text,
        image,
        imagePosition
      },
      _type == 'testimonialSection' => {
        _type,
        heading,
        "testimonials": testimonials[]->
      }
    }
  }
`, { slug: "home" })
```

## Rendering Content

### Rendering Rich Text with Portable Text

The blog post body and many other text fields use Portable Text format. Use the `@portabletext/react` package to render it:

```jsx
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import { CodeBlock } from '@/components/CodeBlock'

// Define custom components for PortableText
const components = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt || ''}
          className="rounded-lg"
        />
        {value.caption && (
          <figcaption className="text-center text-sm mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
    code: ({ value }) => (
      <CodeBlock
        code={value.code}
        language={value.language || 'javascript'}
        filename={value.filename}
      />
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = value.href.startsWith('/')
        ? undefined
        : 'noopener noreferrer'
      return (
        <a href={value.href} rel={rel} className="text-blue-500 hover:underline">
          {children}
        </a>
      )
    },
  },
}

// Using in a component
const BlogPost = ({ post }) => {
  return (
    <article>
      <h1>{post.title}</h1>
      <div className="prose max-w-none">
        <PortableText value={post.body} components={components} />
      </div>
    </article>
  )
}
```

### Handling Images

Use the `urlFor` function to generate image URLs with transformations:

```jsx
import { urlFor } from '@/lib/sanity'

// Basic image with width transformation
<img src={urlFor(house.mainImage).width(600).url()} alt={house.name} />

// Image with multiple transformations
<img 
  src={urlFor(person.image)
    .width(300)
    .height(300)
    .fit('crop')
    .crop('focalpoint')
    .focalPoint(person.image.hotspot.x, person.image.hotspot.y)
    .url()}
  alt={person.name}
  className="rounded-full"
/>
```

### Handling Code Blocks

For code blocks in blog posts, create a dedicated component:

```jsx
import React from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'

// Load additional languages as needed

export const CodeBlock = ({ code, language, filename }) => {
  React.useEffect(() => {
    Prism.highlightAll()
  }, [code])

  return (
    <div className="code-block my-6 rounded-lg overflow-hidden">
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
          {filename}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language || 'javascript'}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
```

## Working with References and Relationships

### Nested Queries and References

Sanity uses references to connect related documents. Use the `->` operator to follow references:

```javascript
// Get houses with their amenities
const houses = await client.fetch(`
  *[_type == "house"] {
    _id,
    name,
    "amenities": amenities[]-> {
      _id,
      name,
      icon
    }
  }
`)

// Get blog posts with author details
const posts = await client.fetch(`
  *[_type == "blogPost"] {
    _id,
    title,
    "author": author-> {
      name,
      image,
      bio
    }
  }
`)
```

### Filtering Based on References

```javascript
// Get all events associated with a specific house
const houseEvents = await client.fetch(`
  *[_type == "event" && references($houseId)] {
    _id,
    title,
    dateTime
  }
`, { houseId: "house-document-id" })
```

## Pagination

Implement pagination using the `[start...end]` slice syntax:

```javascript
const ITEMS_PER_PAGE = 6

export async function getPagedBlogPosts(page = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE

  const query = `{
    "posts": *[_type == "blogPost"] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage
    },
    "total": count(*[_type == "blogPost"])
  }`

  const result = await client.fetch(query, { start, end })
  return {
    posts: result.posts,
    totalPages: Math.ceil(result.total / ITEMS_PER_PAGE),
    currentPage: page
  }
}
```

## Real-time Updates with GROQ Subscriptions

For features that need real-time updates:

```javascript
import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'

export function useEvents(houseId) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const query = `*[_type == "event" && house._ref == $houseId]`
    const params = { houseId }

    // Initial fetch
    client.fetch(query, params).then(setEvents)

    // Set up subscription for real-time updates
    const subscription = client.listen(query, params).subscribe(update => {
      const wasCreated = update.mutations.some(
        m => m.create && m.document._id === update.documentId
      )
      const wasDeleted = update.mutations.some(
        m => m.delete && m.documentId === update.documentId
      )

      if (wasCreated) {
        setEvents(prev => [...prev, update.result])
      } else if (wasDeleted) {
        setEvents(prev => prev.filter(event => event._id !== update.documentId))
      } else {
        // Document was updated
        setEvents(prev =>
          prev.map(event =>
            event._id === update.documentId ? update.result : event
          )
        )
      }
    })

    return () => subscription.unsubscribe()
  }, [houseId])

  return events
}
```

## Preview Mode

Set up preview mode to allow viewing draft content:

```javascript
// pages/api/preview.js
export default function preview(req, res) {
  if (!req.query.secret || req.query.secret !== process.env.SANITY_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: req.query.slug })
  res.end()
}

// In your getStaticProps functions
export async function getStaticProps({ params, preview = false }) {
  const query = `*[_type == "blogPost" && slug.current == $slug] {
    // fields
  }`
  
  // If preview mode is active, query both draft and published content
  const queryParams = preview
    ? { slug: params.slug, draft: `drafts.`}
    : { slug: params.slug }
  
  const post = await client.fetch(
    preview
      ? `*[_type == "blogPost" && (slug.current == $slug || slug.current == $draft + $slug)][0]`
      : `*[_type == "blogPost" && slug.current == $slug][0]`,
    queryParams
  )

  return {
    props: {
      post,
      preview,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}
```

## Generating Static Pages

For static site generation with dynamic routes:

```javascript
// In pages/blog/[slug].js
export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "blogPost" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map(slug => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const post = await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      // fields
    }`,
    { slug: params.slug }
  )

  if (!post) {
    return { notFound: true }
  }

  return {
    props: { post },
    revalidate: 60,
  }
}
```

## Common GROQ Patterns

### Filtering

```javascript
// Posts from a specific category
*[_type == "blogPost" && $categoryId in categories[]._ref]

// Houses with a specific amenity
*[_type == "house" && $amenityId in amenities[]._ref]

// Content published after a specific date
*[_type == "event" && publishedAt > $date]
```

### Sorting

```javascript
// Ascending sort by date
*[_type == "event"] | order(dateTime asc)

// Descending sort by title
*[_type == "house"] | order(name desc)

// Multiple sort criteria
*[_type == "person"] | order(role asc, name asc)
```

### Projections (Selecting Fields)

```javascript
// Basic field selection
*[_type == "house"] { _id, name, location }

// Computed fields
*[_type == "blogPost"] {
  _id,
  title,
  "wordCount": length(pt::text(body)) / 5,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}

// Conditionally include a field
*[_type == "person"] {
  _id,
  name,
  ...select(
    role == "team" => { 
      position, 
      joinedAt
    },
    role == "resident" => { 
      house->, 
      skills 
    },
    {}
  )
}
```

### Using Parameters

```javascript
// Using parameters for query values
const result = await client.fetch(
  `*[_type == "blogPost" && _createdAt > $since] | order(publishedAt desc)`,
  { since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
)
```

## Best Practices

### Querying Efficiency

1. **Only request what you need**: Specify exactly which fields to fetch rather than using `*`
2. **Use projections**: Transform data at query time to match your component needs
3. **Batch related queries**: Use projection syntax to fetch multiple related datasets in one query

### Performance Optimization

1. **Use the CDN**: Enable `useCdn: true` in production for better performance
2. **Implement ISR**: Use Next.js Incremental Static Regeneration for fast, fresh content
3. **Paginate results**: Always paginate long lists of content
4. **Use webp format**: For images, add `.format('webp')` to the image URL builder

### Error Handling

```javascript
try {
  const result = await client.fetch(query, params)
  return result
} catch (error) {
  console.error('Error fetching data from Sanity:', error)
  return null // Or appropriate fallback
}
```

### TypeScript Integration

Create types matching your Sanity schema:

```typescript
// types/sanity.ts
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  alt?: string
  caption?: string
}

export interface House {
  _id: string
  _type: 'house'
  name: string
  slug: { current: string }
  location: {
    address: string
    city: string
    state: string
    zip: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  description: any[] // Portable Text
  mainImage: SanityImage
  amenities: Amenity[]
}

// More interfaces for other types
```

## Conclusion

This documentation provides a comprehensive guide for integrating the Accelr8 Sanity CMS with your Next.js frontend. By following these patterns and best practices, you can efficiently build dynamic, content-rich features that leverage all the capabilities of our content model.

For more advanced queries or help with specific integration challenges, refer to the Sanity documentation or reach out to the backend team. 