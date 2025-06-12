namespace madan.MVC.Data.Models;

public class ProductPrice : Entity
{
    public long ProductId { set; get; }
    public DateTime EffectiveDate { set; get; }
    public decimal Price { set; get; }
    public string? Description { set; get; }

    public Product Product { set; get; }
}
