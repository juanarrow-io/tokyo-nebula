from dataclasses import dataclass
from typing import AsyncIterator


@dataclass
class Nebula:
    """A cluster of color variants forming a theme family."""

    name: str
    variants: list[str]

    async def stream(self) -> AsyncIterator[str]:
        # yield each variant in sequence
        for v in self.variants:
            yield f"{self.name}::{v}"
