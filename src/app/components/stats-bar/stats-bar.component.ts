import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-bar.component.html',
  styleUrl: './stats-bar.component.css'
})
export class StatsBarComponent {

  @Input() title!: string;
  @Input() accuracy!: number;
  @Input() speed!: number;
  @Input() roundCount!: number;

  placeholderSpeed: string = "000.00 wpm";

}
