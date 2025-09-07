import { ContainerScroll } from "./ContainerScroll";

export const TaskDashboardSection = () => {
  const images = [
    "/dashboard.png",
    "/task-dashboard.png", 
    "/report-dashboard.png"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <ContainerScroll
        titleComponent={
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dashboard
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Monitor your URL submissions, track indexing progress, and manage your SEO campaigns all in one place
            </p>
          </div>
        }
        images={images}
      />
    </section>
  );
};
