using System.ComponentModel.DataAnnotations;

namespace madan.MVC.Data.Models;

public class Product : Entity
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public ICollection<ProductPrice> ProductPrices { get; set; } = [];
}
