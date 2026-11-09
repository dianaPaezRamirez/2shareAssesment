using GroceryList.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GroceryList.Infrastructure.Persistence.Configurations;

public class GroceryItemConfiguration : IEntityTypeConfiguration<GroceryItem>
{
    public void Configure(EntityTypeBuilder<GroceryItem> builder)
    {
        builder.ToTable("GroceryItems");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Name)
            .HasMaxLength(GroceryItem.NameMaxLength)
            .IsRequired();

        builder.Property(i => i.IsTagged)
            .IsRequired();

        builder.Property(i => i.CreatedAt)
            .IsRequired();

        builder.HasQueryFilter(i => i.DeletedAt == null);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
