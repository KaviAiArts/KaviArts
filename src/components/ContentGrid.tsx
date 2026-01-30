import ContentItem from "@/components/ContentItem";

const ContentGrid = ({ items = [] }: { items?: any[] }) => {
  if (!items.length) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No content available.
      </p>
    );
  }

  return (
 <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
  {items.map((item, index) => (
    <ContentItem 
      key={item.id} 
      item={item} 
      priority={index < 6} 
    />
  ))}
</div>
  );
};

export default ContentGrid;