using System.ComponentModel.DataAnnotations;

namespace madan.MVC.Data.Models;

public class CostCategory : Entity
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    public bool IsActive { get; set; } = true;
}
