using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using madan.MVC.Data;
using madan.MVC.Data.Models;

namespace madan.MVC.Controllers
{
    public class CostCategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CostCategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CostCategory
        public async Task<IActionResult> Index()
        {
            var costCategories = await _context.CostCategories.ToListAsync();
            return View(costCategories);
        }

        // GET: CostCategory/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var costCategory = await _context.CostCategories
                .FirstOrDefaultAsync(m => m.Id == id);
            if (costCategory == null)
            {
                return NotFound();
            }

            return View(costCategory);
        }

        // GET: CostCategory/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CostCategory/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,IsActive")] CostCategory costCategory)
        {
            if (ModelState.IsValid)
            {
                _context.Add(costCategory);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(costCategory);
        }

        // GET: CostCategory/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var costCategory = await _context.CostCategories.FindAsync(id);
            if (costCategory == null)
            {
                return NotFound();
            }
            return View(costCategory);
        }

        // POST: CostCategory/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("Id,Name,IsActive")] CostCategory costCategory)
        {
            if (id != costCategory.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(costCategory);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CostCategoryExists(costCategory.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(costCategory);
        }

        // GET: CostCategory/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var costCategory = await _context.CostCategories
                .FirstOrDefaultAsync(m => m.Id == id);
            if (costCategory == null)
            {
                return NotFound();
            }

            return View(costCategory);
        }

        // POST: CostCategory/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var costCategory = await _context.CostCategories.FindAsync(id);
            if (costCategory != null)
            {
                _context.CostCategories.Remove(costCategory);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool CostCategoryExists(long id)
        {
            return _context.CostCategories.Any(e => e.Id == id);
        }
    }
} 