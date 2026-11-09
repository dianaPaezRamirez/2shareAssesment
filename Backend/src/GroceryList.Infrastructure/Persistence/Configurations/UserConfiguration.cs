using GroceryList.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GroceryList.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Username)
            .HasMaxLength(User.UsernameMaxLength)
            .IsRequired();

        // The default SQL Server collation is case-insensitive,
        // so "Diana" and "diana" are treated as the same username.
        builder.HasIndex(u => u.Username)
            .IsUnique();

        builder.Property(u => u.FullName)
            .HasMaxLength(User.FullNameMaxLength)
            .IsRequired();

        builder.Property(u => u.PasswordHash)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(u => u.CreatedAt)
            .IsRequired();
    }
}
