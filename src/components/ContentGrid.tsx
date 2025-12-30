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
      {items.map((item) => (
        <ContentItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ContentGrid;