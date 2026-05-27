use std::fmt;

pub struct Palette<'a> {
    pub name: &'a str,
    pub hues: Vec<u32>,
}

impl<'a> fmt::Display for Palette<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self.hues.first() {
            Some(h) => write!(f, "{} (#{:06X})", self.name, h),
            None => write!(f, "{} (empty)", self.name),
        }
    }
}
