using Microsoft.EntityFrameworkCore;
using madan.MVC.Models;
using madan.MVC.Data.Models;

namespace madan.MVC.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Withdrawer> Withdrawers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<CostCategory> CostCategories { get; set; }
        public DbSet<ProductPrice> ProductPrices { get; set; }
        public DbSet<MaterialWithdrawal> MaterialWithdrawals { get; set; }
        public DbSet<MaterialWithdrawalPay> MaterialWithdrawalPays { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial product data
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "شسته", IsActive = true },
                new Product { Id = 2, Name = "بادامی", IsActive = true },
                new Product { Id = 3, Name = "مخلوط", IsActive = true },
                new Product { Id = 4, Name = "نخودی طبیعی", IsActive = true },
                new Product { Id = 5, Name = "نخودی شکسته", IsActive = true },
                new Product { Id = 6, Name = "سرندی", IsActive = true },
                new Product { Id = 7, Name = "قلوه سنگ", IsActive = true },
                new Product { Id = 8, Name = "ماسه شکسته", IsActive = true },
                new Product { Id = 9, Name = "پشت سرندی", IsActive = true }
            );

            // Seed initial cost categories data
            modelBuilder.Entity<CostCategory>().HasData(
                new CostCategory { Id = 1, Name = "هزینه عیدی", IsActive = true },
                new CostCategory { Id = 2, Name = "هزینه بیمه مسئولیت", IsActive = true },
                new CostCategory { Id = 3, Name = "هزینه باربرگ", IsActive = true },
                new CostCategory { Id = 4, Name = "هزینه تعمیرات", IsActive = true },
                new CostCategory { Id = 5, Name = "هزینه ملزومات اداری", IsActive = true },
                new CostCategory { Id = 6, Name = "هزینه معدن", IsActive = true },
                new CostCategory { Id = 7, Name = "هزینه بیمه ثالث", IsActive = true },
                new CostCategory { Id = 8, Name = "هزینه سوخت", IsActive = true },
                new CostCategory { Id = 9, Name = "هزینه سیستم تصفیه آب", IsActive = true },
                new CostCategory { Id = 10, Name = "هزینه آب", IsActive = true },
                new CostCategory { Id = 11, Name = "هزینه پراید", IsActive = true },
                new CostCategory { Id = 12, Name = "هزینه نیسان", IsActive = true },
                new CostCategory { Id = 13, Name = "هزینه ایاب ذهاب", IsActive = true }
            );
        }
    }
} 