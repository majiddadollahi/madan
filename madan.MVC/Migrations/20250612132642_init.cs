using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace madan.MVC.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CostCategories",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MaterialWithdrawals",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WithdrawerId = table.Column<long>(type: "bigint", nullable: false),
                    ProductId = table.Column<long>(type: "bigint", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialWithdrawals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Withdrawers",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Withdrawers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MaterialWithdrawalPays",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaterialWithdrawalId = table.Column<long>(type: "bigint", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialWithdrawalPays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaterialWithdrawalPays_MaterialWithdrawals_MaterialWithdrawalId",
                        column: x => x.MaterialWithdrawalId,
                        principalTable: "MaterialWithdrawals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductPrices",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<long>(type: "bigint", nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPrices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPrices_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "CostCategories",
                columns: new[] { "Id", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1L, true, "هزینه عیدی" },
                    { 2L, true, "هزینه بیمه مسئولیت" },
                    { 3L, true, "هزینه باربرگ" },
                    { 4L, true, "هزینه تعمیرات" },
                    { 5L, true, "هزینه ملزومات اداری" },
                    { 6L, true, "هزینه معدن" },
                    { 7L, true, "هزینه بیمه ثالث" },
                    { 8L, true, "هزینه سوخت" },
                    { 9L, true, "هزینه سیستم تصفیه آب" },
                    { 10L, true, "هزینه آب" },
                    { 11L, true, "هزینه پراید" },
                    { 12L, true, "هزینه نیسان" },
                    { 13L, true, "هزینه ایاب ذهاب" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1L, true, "شسته" },
                    { 2L, true, "بادامی" },
                    { 3L, true, "مخلوط" },
                    { 4L, true, "نخودی طبیعی" },
                    { 5L, true, "نخودی شکسته" },
                    { 6L, true, "سرندی" },
                    { 7L, true, "قلوه سنگ" },
                    { 8L, true, "ماسه شکسته" },
                    { 9L, true, "پشت سرندی" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MaterialWithdrawalPays_MaterialWithdrawalId",
                table: "MaterialWithdrawalPays",
                column: "MaterialWithdrawalId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPrices_ProductId",
                table: "ProductPrices",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CostCategories");

            migrationBuilder.DropTable(
                name: "MaterialWithdrawalPays");

            migrationBuilder.DropTable(
                name: "ProductPrices");

            migrationBuilder.DropTable(
                name: "Withdrawers");

            migrationBuilder.DropTable(
                name: "MaterialWithdrawals");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
