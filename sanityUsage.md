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
- **MainPage** - Page builder for specific overview pages (houses, events, blog)

### Content Management Strategy

We use a hybrid approach for content management:

- **Sanity-managed Pages:** Houses, Events, and Blog (highly dynamic content)
- **Next.js-managed Pages:** Homepage, About, Apply, and Contact (more static content)

This approach allows us to focus Sanity CMS on the most content-heavy and frequently updated pages while keeping simpler pages directly in the codebase for ease of development.

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

Our MainPage schema now supports specific page types (housesOverview, eventsOverview, blogOverview) with structured sections:

```javascript
// Get a specific overview page by pageType
const housesOverviewPage = await client.fetch(`
  *[_type == "mainPage" && pageType == "housesOverview"][0] {
    _id,
    title,
    slug,
    hero {
      heading,
      subheading,
      backgroundImage,
      ctaButton
    },
    contentSections[] {
      _type == 'featuredHousesSection' => {
        _type,
        heading,
        subheading,
        houses[]-> {
          _id,
          name,
          slug,
          location,
          mainImage
        }
      },
      _type == 'textSection' => {
        _type,
        heading,
        content
      },
      _type == 'statsSection' => {
        _type,
        heading,
        introduction,
        stats
      },
      _type == 'testimonialSection' => {
        _type,
        heading,
        testimonials[]->
      }
    },
    seo
  }
`)
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

### Rendering Next.js Managed Pages

For pages managed directly in Next.js (Homepage, About, Apply, Contact), we use standard React components without Sanity data fetching:

```jsx
// Example for the About page (src/app/about/page.tsx)
import { Metadata } from 'next'
import { PublicLayout } from '@/components/layout/public-layout'

export const metadata: Metadata = {
  title: 'About Accelr8 | Our Mission and Team',
  description: 'Learn about Accelr8\'s mission, values, and the team behind our hacker houses.'
}

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Page content defined directly in the component */}
      <section className="...">
        <h1>About Accelr8</h1>
        <p>...</p>
      </section>
      
      {/* Additional sections */}
    </PublicLayout>
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

## Best Practices

### Hybrid Content Management

1. **Clear Separation of Concerns**:
   - Use Sanity for dynamic, frequently updated, and content-rich pages (houses, events, blog)
   - Use Next.js for more static, structure-heavy pages (homepage, about, apply, contact)

2. **Fallback Strategies**:
   - Implement fallbacks in components that fetch Sanity data
   - Use loading states for better UX during fetching

3. **API Organization**:
   - Create separate API functions for different content types
   - Keep data transformation logic in the API layer, not the components

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

## Conclusion

This documentation provides a comprehensive guide for integrating the Accelr8 Sanity CMS with your Next.js frontend. By following these patterns and best practices, you can efficiently build dynamic, content-rich features that leverage all the capabilities of our content model.

For more advanced queries or help with specific integration challenges, refer to the Sanity documentation or reach out to the backend team. 