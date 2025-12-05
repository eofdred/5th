use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;
use web_sys::{CanvasRenderingContext2d, ImageData};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format!($($t)*)))
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Empty = 0,
    Tree = 1,
    Fire = 2,
    Burnt = 3,
}

#[wasm_bindgen]
pub struct Forest {
    width: u32,
    height: u32,
    grid: Vec<Cell>,
    next_grid: Vec<Cell>,
    burn_times: Vec<f64>, // Timestamp in seconds
    
    // Parameters
    trees_per_sec: u32,
    growth_accumulator: f64,
    ignition_threshold: f64,
    cooldown_seconds: f64,
    lightning_interval: f64,
    
    last_time: f64,
    last_lightning_time: f64,
}

#[wasm_bindgen]
impl Forest {
    pub fn new(width: u32, height: u32) -> Forest {
        let size = (width * height) as usize;
        let now = web_sys::window().unwrap().performance().unwrap().now() / 1000.0;
        
        Forest {
            width,
            height,
            grid: vec![Cell::Empty; size],
            next_grid: vec![Cell::Empty; size],
            burn_times: vec![0.0; size],
            
            trees_per_sec: 50,
            growth_accumulator: 0.0,
            ignition_threshold: 0.20,
            cooldown_seconds: 10.0,
            lightning_interval: 30.0,
            
            last_time: now,
            last_lightning_time: now,
        }
    }
    
    pub fn set_params(&mut self, trees_per_sec: u32, ignition_threshold: f64, cooldown_seconds: f64, lightning_interval: f64) {
        self.trees_per_sec = trees_per_sec;
        self.ignition_threshold = ignition_threshold;
        self.cooldown_seconds = cooldown_seconds;
        self.lightning_interval = lightning_interval;
    }

    pub fn reset(&mut self) {
        let size = (self.width * self.height) as usize;
        self.grid = vec![Cell::Empty; size];
        self.next_grid = vec![Cell::Empty; size];
        self.burn_times = vec![0.0; size];
    }
    
    pub fn trees_count(&self) -> u32 {
        self.grid.iter().filter(|&&x| x == Cell::Tree).count() as u32
    }

    fn get_index(&self, x: i32, y: i32) -> Option<usize> {
        if x < 0 || x >= self.width as i32 || y < 0 || y >= self.height as i32 {
            None
        } else {
            Some((y as usize) * (self.width as usize) + (x as usize))
        }
    }

    pub fn tick(&mut self) {
        let now = web_sys::window().unwrap().performance().unwrap().now() / 1000.0;
        let dt = now - self.last_time;
        self.last_time = now;

        let mut fire_count = 0;
        let mut tree_count = 0;

        // Pass 1: Dynamics
        for y in 0..self.height {
            for x in 0..self.width {
                let idx = (y * self.width + x) as usize;
                let state = self.grid[idx];
                
                match state {
                    Cell::Tree => {
                        tree_count += 1;
                        self.next_grid[idx] = Cell::Tree;
                        
                        let mut catch_fire = false;
                        'search: for dy in -2..=2 {
                            for dx in -2..=2 {
                                if dx == 0 && dy == 0 { continue; }
                                if let Some(n_idx) = self.get_index(x as i32 + dx, y as i32 + dy) {
                                    if self.grid[n_idx] == Cell::Fire {
                                        catch_fire = true;
                                        break 'search;
                                    }
                                }
                            }
                        }
                        
                        if catch_fire {
                            self.next_grid[idx] = Cell::Fire;
                        }
                    },
                    Cell::Fire => {
                        fire_count += 1;
                        self.next_grid[idx] = Cell::Burnt;
                        self.burn_times[idx] = now;
                    },
                    Cell::Burnt => {
                        if now - self.burn_times[idx] >= self.cooldown_seconds {
                            self.next_grid[idx] = Cell::Empty;
                        } else {
                            self.next_grid[idx] = Cell::Burnt;
                        }
                    },
                    Cell::Empty => {
                        self.next_grid[idx] = Cell::Empty;
                    }
                }
            }
        }
        
        // Pass 2: Growth
        if fire_count == 0 {
            self.growth_accumulator += self.trees_per_sec as f64 * dt;
            let trees_to_plant = self.growth_accumulator.floor() as u32;
            self.growth_accumulator -= trees_to_plant as f64;
            
            let mut trees_left = trees_to_plant;
            let mut safety = trees_to_plant * 50 + 1000;
            
            while trees_left > 0 && safety > 0 {
                safety -= 1;
                let mut rng_buf = [0u8; 4];
                getrandom::getrandom(&mut rng_buf).unwrap();
                let r_idx = (u32::from_le_bytes(rng_buf) % (self.width * self.height)) as usize;
                
                if self.next_grid[r_idx] == Cell::Empty {
                    let rx = (r_idx as u32 % self.width) as i32;
                    let ry = (r_idx as u32 / self.width) as i32;
                    
                    let mut neighbors = 0;
                    for dy in -1..=1 {
                        for dx in -1..=1 {
                            if dx == 0 && dy == 0 { continue; }
                            if let Some(n_idx) = self.get_index(rx + dx, ry + dy) {
                                if self.grid[n_idx] == Cell::Tree {
                                    neighbors += 1;
                                }
                            }
                        }
                    }
                    
                    let chance = if neighbors > 0 { 1.0 } else { 0.05 };
                    
                    let mut chance_buf = [0u8; 4];
                    getrandom::getrandom(&mut chance_buf).unwrap();
                    let rnd_val = (u32::from_le_bytes(chance_buf) as f64) / (u32::MAX as f64);
                    
                    if rnd_val < chance {
                        self.next_grid[r_idx] = Cell::Tree;
                        trees_left -= 1;
                    }
                }
            }
        } else {
            self.growth_accumulator = 0.0;
        }

        // Ignition
        let density = tree_count as f64 / (self.width * self.height) as f64;
        
        // Density trigger
        if density >= self.ignition_threshold {
             // Ignite random tree
            let mut rng_buf = [0u8; 4];
            for _ in 0..50 {
                getrandom::getrandom(&mut rng_buf).unwrap();
                let r_idx = (u32::from_le_bytes(rng_buf) % (self.width * self.height)) as usize;
                if self.next_grid[r_idx] == Cell::Tree {
                    self.next_grid[r_idx] = Cell::Fire;
                    break;
                }
            }
        }
        
        // Time trigger
        if now - self.last_lightning_time >= self.lightning_interval {
            self.last_lightning_time = now;
            
            let mut trees = Vec::new();
            for (i, cell) in self.next_grid.iter().enumerate() {
                if *cell == Cell::Tree {
                    trees.push(i);
                }
            }
            
            if !trees.is_empty() {
                let mut rng_buf = [0u8; 4];
                getrandom::getrandom(&mut rng_buf).unwrap();
                let idx = (u32::from_le_bytes(rng_buf) as usize) % trees.len();
                self.next_grid[trees[idx]] = Cell::Fire;
            }
        }

        self.grid.copy_from_slice(&self.next_grid);
    }

    pub fn draw(&self, ctx: &CanvasRenderingContext2d) {
        let size = (self.width * self.height) as usize;
        let mut data = vec![0u8; size * 4];
        
        for (i, cell) in self.grid.iter().enumerate() {
            let base = i * 4;
            match cell {
                Cell::Tree => {
                    data[base] = 34; data[base+1] = 139; data[base+2] = 34; data[base+3] = 255;
                },
                Cell::Fire => {
                    data[base] = 255; data[base+1] = 69; data[base+2] = 0; data[base+3] = 255;
                },
                Cell::Burnt => {
                    data[base] = 30; data[base+1] = 30; data[base+2] = 30; data[base+3] = 255;
                },
                Cell::Empty => {
                    data[base] = 0; data[base+1] = 0; data[base+2] = 0; data[base+3] = 255;
                }
            }
        }
        
        let image_data = ImageData::new_with_u8_clamped_array_and_sh(Clamped(&data), self.width, self.height).unwrap();
        ctx.put_image_data(&image_data, 0.0, 0.0).unwrap();
    }
}
